import { reactive } from '@vue/composition-api';
import baseService from '@imagina/qcrud/_services/baseService.js'
const modelFolderList = [
    {
        id: 1,
        title: 'Folder 1',
        isCollapse: false,
        reportList: [
            {
                id: 1,
                title: 'report 1',
            },
            {
                id: 2,
                title: 'report 2',
            },
            {
                id: 3,
                title: 'report 3',
            },
            {
                id: 4,
                title: 'report 4',
            }
        ],
    },
    {
        id: 2,
        title: 'Folder 2',
        isCollapse: false,
        reportList: [
            {
                id: 5,
                title: 'report 5',
            },
            {
                id: 6,
                title: 'report 6',
            },
            {
                id: 7,
                title: 'report 7',
            }
        ],
    },
    {
        id: 3,
        title: 'Folder 3',
        isCollapse: false,
        reportList: [
            {
                id: 8,
                title: 'report 8',
            },
            {
                id: 9,
                title: 'report 9',
            }
        ],
    },
    {
        id: 4,
        title: 'Folder 4',
        isCollapse: false,
        reportList: [
            {
                id: 10,
                title: 'report 10',
            }
        ],
    },
    {
        id: 5,
        title: 'Folder 5',
        isCollapse: false,
        reportList: [],
    },
    {
        id: 6,
        title: 'Folder 6',
        isCollapse: false,
        reportList: [],
    },
];
const state = reactive({
    dragReports: false,
});

export default function foldersStore() {
    function getDragReports() {
        return state.dragReports;
    }
    function setDragReports(value) {
        state.dragReports = value;
    }
    function transformDataToDragableForderList(data) {
        try {
            return data.map(item => ({
                ...item,
                isCollapse: false,
                loading: false,
                reportList: [],
            }));
        } catch (error) {
            console.error('[folderStore:transformDataToDragableForderList]');
        }
    }
    async function saveOrderFolders(route, forderList) {
        try {
            const positionFolder = forderList.map(item => ({ id: item.id }));
            await baseService.create(route, positionFolder)
        } catch (error) {
            console.log(error);
            console.error('[folderStore:saveOrderFolders]');
        }
    }
    return {
        transformDataToDragableForderList,
        getDragReports,
        setDragReports,
        saveOrderFolders,
    }
}