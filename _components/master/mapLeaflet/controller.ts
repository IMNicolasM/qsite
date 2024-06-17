import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";
import L from "leaflet";
import {OpenStreetMapProvider} from 'leaflet-geosearch'
import { store } from 'src/plugins/utils.ts'

export default function controller(props: any, emit: any) {
  const proxy = getCurrentInstance()!.appContext.config.globalProperties

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  // States
  const state = reactive({
    // Key: Default Value
    countries: Object,
    map: Object,            
    marker: Object,
    responseValue: false,      
    mapZoom: 6,
    searchLoading: false,
    searchProvider: {}, 
    address: null,
    geolocations: [],
    coordinates: [],
    showSearch: true
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
  }

  // Methods
  const methods = {
    // methodKey: () => {}
    isPositionMarkerMap: () =>  {
      return props.type == 'positionMarkerMap'
    }, 
    init: () => {
      methods.setMap()
      methods.setDefaultValue()
      methods.setPolygon()
    },    
    //Set default values
    async setDefaultValue() {
      //Validate map types
      if(methods.isPositionMarkerMap()){        
        //Set default value and response value        
        let center = props.modelValue//Set default value
        if (center?.lat && center?.lng) {
          state.map.setZoom(15)
          methods.moveMarker(center.lat, center.lng)          
          await methods.getMarkerInfo(center.lat, center.lng) || {}
        } else {              
          center = {lat: props.defaultCenter.lat, lng: props.defaultCenter.lng}
        }
        
        if(props.emitDefault){
          await methods.getMarkerInfo(center.lat, center.lng)
        }      
      }
    },
    //Handler to click over map
    async getMarkerInfo(lat, lng) {
      state.searchLoading = true
      state.address = null
      state.geolocations = []
      const info = {label: '', lat, lng}
      const query = `${lat}, ${lng}`
      await state.searchProvider.search({query}).then((results) => {
        if(results.length){
          const item = results[0]
          info.label = item.label != '' ? item.label : item?.raw.display_name
          if(info.label){
            const mapWidth = state.map.getSize().x
            const maxWidth = mapWidth > 700 ? 600 : (mapWidth - 80) //fix popup width
            state.marker.bindPopup(info.label, {maxWidth}).openPopup();
            //state.marker.bindTooltip(info.label).openTooltip();
          }
        }
      })
      if(!props.polygonControls){ // emits only points
        emit('update:modelValue', info)
      }
      state.searchLoading = false
      return info
    },
    async emitResponseValue() {
      if (state.address) {
        methods.moveMarker(state.address.lat, state.address.lng)
        await methods.getMarkerInfo(state.address.lat, state.address.lng)
      }
    },
    filterFn(val, update, abort) {
      update(async () => {
        await methods.searchLocations(val)
      })
    },
    async searchLocations(val) {
      if(val.length < 4) return false
      state.searchLoading = true
      await state.searchProvider.search({query: val}).then((results) => {
        state.geolocations = results.map(item => {
          return {
            label: item.label,
            value: {
              lat: item.y,
              lng: item.x,
            }
          }
        })
        state.searchLoading = false
      }).catch(e => {
        state.searchLoading = false
      })
    },
    setMap: () => {
      const controlsPosition = 'bottomright' //'bottomright' //default: topleft
      const layer = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
      const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      const accessToken = store.getSetting('isite::api-open-street-maps')      

      state.searchProvider =  new OpenStreetMapProvider({params: {countrycodes: methods.getCountries()}})
      state.map = L.map(props.mapId, {
        editable: true,
        zoomControl: false
      }).setView([props.defaultCenter.lat, props.defaultCenter.lng], state.mapZoom);

      L.tileLayer(layer, {
        attribution, 
        accessToken
      }).addTo(state.map);

      /* readOnly */
      if(props.readOnly){
        state.map.dragging.disable();
      }
      
      L.control.zoom({
        position: controlsPosition
      }).addTo(state.map);

      state.map.addControl(new L.Control.Fullscreen({
        position: controlsPosition
      }));
      
      if(methods.isPositionMarkerMap()){
        state.marker = L.marker([props.defaultCenter.lat, props.defaultCenter.lng]).addTo(state.map)
      } 

      // disable zoon on doubleclick
      state.map.doubleClickZoom.disable();       
     
      if(!props.readOnly){
        /* prevent map propagation by user inputs */
        const div = L.DomUtil.get('leaflet_search_input');
        L.DomEvent.disableClickPropagation(div);
        methods.setMapEvents();

        if(props.polygonControls){
          methods.addEditableControls();
        }
      }
      
    },
    setMapEvents(){
      state.map.on('dblclick', async (event) => {
        const lat = event.latlng.lat
        const lng = event.latlng.lng        
        if (methods.isPositionMarkerMap() && !props.readOnly){
          state.geolocations = []
          state.address = null
          methods.moveMarker(lat, lng)
          await methods.getMarkerInfo(lat, lng)
        }
      })

      state.map.on('movestart', async (event) => {
        state.showSearch = false
      });

      state.map.on('moveend', async (event) => {
        state.showSearch = true
      });
      
      // Polygons
      // Getcoordinates and type       
      if(props.polygonControls){
        state.map.on('editable:drawing:start', async (event) => {
          state.showSearch = false
        });

        state.map.on('editable:drawing:end', async (event) => {
          state.showSearch = true
        });

        state.map.on('editable:drawing:commit', async (event) => {
          methods.getGeometry(event)
          state.showSearch = true
        });

        state.map.on('editable:vertex:dragstart', async (event) => {
          state.showSearch = false
        });

        state.map.on('editable:vertex:dragend', async (event) => {
          state.showSearch = true
          methods.getGeometry(event)
        });

        // 
        state.map.on('layeradd', async (e) => {
            const layer = e.layer
            if (e.layer instanceof L.Path) e.layer.on('click', L.DomEvent.stop).on('click', (e) => {            //layer.toggleEdit
              if ((e.originalEvent.ctrlKey || e.originalEvent.metaKey) ) layer.editor.deleteShapeAt(e.latlng);
            }, e.layer);          
        });
      }
    },
    //force to load maker images
    setIconSettings(){
      L.Marker.prototype.options.icon = L.icon({
          iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
          iconUrl: require("leaflet/dist/images/marker-icon.png"),
          shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          tooltipAnchor: [16, -28],
          shadowSize: [41, 41],
        }
      );
    }, 
    moveMarker(lat, lng){
      state.map.setView([lat, lng], state.map.getZoom())
      state.marker.setLatLng([lat, lng])
    }, 
    getCountries(){
      const value = store.getSetting('ilocations::availableCountries') || ["co"]
      return value.map(val => val.toLowerCase())
    },    
    //
    // Polygon - editable controls     
    //
    addEditableControls(){
      // Adds control layer
      L.EditControl = L.Control.extend({
        options: {
          position: 'topleft',
          callback: null,
          title: '',
          html: ''
        },
      onAdd: function (map) {
          var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
          link = L.DomUtil.create('a', '', container);
          link.href = '#';
          link.title = this.options.title;
          link.innerHTML = this.options.html;
          L.DomEvent.on(link, 'click', L.DomEvent.stop)
                    .on(link, 'click', function () {
                      methods.deletePolygons()
                      window.LAYER = this.options.callback.call(map.editTools);
                    }, this);
          return container;
        }
      });
      //Line control
      L.NewLineControl = L.EditControl.extend({
        options: {
            position: 'topleft',
            callback: state.map.editTools.startPolyline,
            title: 'Draw a Line',
            html: '<i class="fa-light fa-pen-line fa-xl"></i>'
        }
      });
      //Polygon control
      L.NewPolygonControl = L.EditControl.extend({
        options: {
          position: 'topleft',
          callback: state.map.editTools.startPolygon,
          title: 'Draw a Polygon',
          html: '<i class="fa-light fa-draw-polygon fa-xl"></i>'
        }
      });
      //Rectangle control
      L.NewRectangleControl = L.EditControl.extend({
        options: {
          position: 'topleft',
          callback: state.map.editTools.startRectangle,
          title: 'Draw a Rectangle',
          html: '<i class="fa-light fa-draw-square fa-xl"></i>'
        }
      });
      //Circle control
      L.NewCircleControl = L.EditControl.extend({
        options: {
            position: 'topleft',
            callback: state.map.editTools.startCircle,
            title: 'Draw a Rectangle',
            html: '<i class="fa-light fa-draw-circle fa-xl"></i>'
        }
      });
      //clear control
      L.NewDeleteControl = L.EditControl.extend({
        options: {
            position: 'topleft',
            callback: () => methods.deletePolygons(),
            title: 'Delete the shape',
            html: '<i class="fa-light fa-trash fa-xl"></i>'
        }
      });

      // Add controls    
      // state.map.addControl(new L.NewLineControl());
      state.map.addControl(new L.NewPolygonControl()); //
      state.map.addControl(new L.NewRectangleControl());
      // state.map.addControl(new L.NewCircleControl());
      
      //custom delete control
      state.map.addControl(new L.NewDeleteControl());     
    }, 
    // emits geometry: {type: String, coordinates: Array }
    getGeometry(event){
      const geometry = event.layer.toGeoJSON().geometry
      let points = geometry.coordinates[0]      
      points = points.map((x) => {
        return {
          lat: x[1], lng: x[0]
        }
      });
      emit('update:modelValue', {...props.modelValue, points})
    }, 
    // Delete all Polygon
    deletePolygons(){
      state.map.eachLayer(layer => {
        if (typeof layer._latlngs !== 'undefined' && layer._latlngs.length > 0) {
          layer.remove()
        }
      })
      emit('update:modelValue', {...props.modelValue, points: []})
    }, 
    setPolygon(){
      let polygon = null      
      if (props.modelValue?.points) {
        let points = props.modelValue.points
        if(points.length){          
          points = points.map((x) => [x.lat, x.lng]);
          //rectangle
          if(points.length == 4){
            polygon = L.rectangle(points).addTo(state.map)
          } else {
            polygon = L.polygon(points).addTo(state.map)
          }
          if(!props.readOnly){
            polygon.enableEdit()
          }

          state.map.fitBounds(polygon.getBounds());          
        }
      }
    }

    
  }

  // Mounted
  onMounted(() => {
    methods.setIconSettings()
    methods.init()
  })

  // Watch
  watch(props, (newField, oldField): void => {
    const model = newField.modelValue
    if(model?.lat && model?.lng){
      methods.moveMarker(model.lat, model.lng)
    }
    if(model?.points){
      if(model.points.length) methods.setPolygon()
    }
    
  }, {deep: true})

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
