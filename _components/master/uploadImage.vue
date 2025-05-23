<template>
  <div id="uploadImageComponent">
    <div id="contentUploadImage" @click="file == '' ? uploadFile() : false" class="full-width full-height">
      <!--Preview of image-->
      <avatar-image 
        :height="height" 
        :width="width" 
        :src="getImageUrl" 
        class="img-file" 
        v-if="!hiddePreview"
        :noOpen="noOpen"
      />
      <!--Button edit image-->
      <q-btn id="actionbutton" icon="fas fa-camera" :color="color" :loading="loading" rounded>
        <q-menu v-if="file">
          <!--Change or upload image-->
          <q-item @click.native="uploadFile()" clickable v-close-popup>
            <q-item-section avatar>
              <q-icon name="fas fa-file-image" :color="color"/>
            </q-item-section>
            <q-item-section>
              {{(file == '') ? $tr('isite.cms.message.uploadImage') : $tr('isite.cms.message.changeImage')}}
            </q-item-section>
          </q-item>
          <!--Remove image-->
          <q-item v-if="file != ''" clickable v-close-popup
                  @click.native="removeFile()">
            <q-item-section avatar>
              <q-icon name="fas fa-trash" :color="color"/>
            </q-item-section>
            <q-item-section>{{$tr('isite.cms.message.deleteImage')}}</q-item-section>
          </q-item>
        </q-menu>
      </q-btn>
      <!--Loading-->
      <inner-loading :visible="loading"/>
    </div>
    <!--Uploader image-->
    <q-uploader url="" ref="uploadComponent" v-model="file" v-show="false"
                @added="setFile" extensions=".jpg" accept=".jpg, image/*"/>
  </div>
</template>

<script>
  export default {
    props: {
      color: {default: 'primary'},
      rounded: {type: Boolean, default: false},
      width: {default: '180px'},
      height: {default: '180px'},
      modelValue: {default: null},
      defaultImage: {default: false},
      hiddePreview: {type: Boolean, default: false},
      noOpen: {type: Boolean, default: false}
    },
    emits: ['update:modelValue'],
    components: {},
    watch: {
      modelValue() {
        this.loadImage()
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.loadImage()
      })
    },
    data() {
      return {
        loading: false,
        file: ''
      }
    },
    computed: {
      //Return path image
      getImageUrl() {
        if (this.file != '') return this.file//If file exist, add to path
        return this.defaultImage || this.defaultImg//Return path image
      },
      //Return styles to image
      stylesImage() {
        return `
        background-image: url(${this.getImageUrl});
        width : ${this.width};
        height: ${this.height};
        border-radius: ${this.rounded ? '50%' : '10px'}
      `
      },
      //Default image
      defaultImg() {
        return `${this.$store.state.qsiteApp.baseUrl}/modules/iblog/img/post/default.jpg`
      }
    },
    methods: {
      //load image from value prop if exist
      loadImage() {
        if (this.modelValue) this.file = this.$clone(this.modelValue)
      },
      //Dispath upload file event
      async uploadFile() {
        this.$refs.uploadComponent.reset()
        setTimeout(() => {
          this.$refs.uploadComponent.pickFiles()
        }, 500);
      },
      //Add image to data file
      setFile(files) {
        this.loading = true
        setTimeout(async () => {
          this.file = await this.getBase64(files[0])
          this.$emit('update:modelValue', this.file)
          this.loading = false
        }, 500)
      },
      //get base 64 from blob file
      getBase64(file) {
        return new Promise((resolve, reject) => {
          let srcFile = file.__img.src
          //Validate blob file
          if (srcFile.indexOf('blob') == -1) return resolve(srcFile)
          //Get base 64 from blob file
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function () {
            resolve(reader.result);
          };
        })
      },
      //Remove file
      removeFile() {
        return new Promise((resolve, reject) => {
          if (this.file != '') {
            this.loading = true
            setTimeout(() => {
              this.$refs.uploadComponent.reset()
              this.file = ''
              this.loading = false
              this.$emit('update:modelValue', this.file)
              return resolve(true)
            }, 500)
          } else {
            return resolve(true)
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  #uploadImageComponent {
    margin: 0 auto;
    position: relative;
    width: 100%;

    .img-file {
      position: relative;
      margin: 0 auto;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      max-width: 100%;
    }

    #actionbutton {
      position: absolute;
      bottom: 20px;
      right: 20px;
      height: 45px !important;
      width: 45px !important;
      width: max-content;
    }

    .loading {
      position: absolute;
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
  }

  #avatarImageComponent {
    width: 100% !important;

    .avatar-img-content {
      border-radius: 0px !important;
      width: 100% !important;
    }
  }
</style>
