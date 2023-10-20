import Vue, 
{ computed, ref, getCurrentInstance, onBeforeUnmount} 
from "vue";
import { 
    CommentModelContract, 
    EditorConfigContract,
    apiRouteDefault,
    commentModelConst,
    commentsContract,
    commentableTypeDefault,
    permissionsCommentsDefault,
} from "@imagina/qsite/_components/master/comments/contracts/comments";

export default function useComments(props: any) {
    const proxy = (getCurrentInstance() as any).proxy as any;
    const dataComment: any = ref({
      edit: false,
      id: null,
      close: false,
    })
    const files = ref({
        value: null,
        type: 'uploader',
        props: {
          title:  Vue.prototype.$trp('isite.cms.label.file'),
          gridColClass: 'col-3 col-md-3 col-lg-4',
          maxFiles: 3,
        }
      })
      const loadingComment = ref(false);
      const commentableType = computed<string>(() => props.commentableType);
      const commentModel = ref<CommentModelContract>({...commentModelConst});
      const route = computed<string>(() => props.apiRoute);
      const mainImage = computed(() => {
        return item => item.userProfile && item.userProfile?.mainImage 
        ? item.userProfile.mainImage: commentModelConst.avatar;
      })
      const tr = ref(Vue.prototype.$tr);
      const comments = ref<commentsContract[]>([]);
      const loading = ref<boolean>(false);
      const permisionComments = computed(() => ({
        create: Vue.prototype.$auth.hasAccess(`${props.permisionComments}.create`),
        edit: Vue.prototype.$auth.hasAccess(`${props.permisionComments}.edit`),
        index: Vue.prototype.$auth.hasAccess(`${props.permisionComments}.index`),
        destroy: Vue.prototype.$auth.hasAccess(`${props.permisionComments}.destroy`),
      }));
      const dataBase = ref<any>({ ...commentModel.value });
      const textPlaceholder = ref<string>(tr.value(`requestable.cms.message.writeComment`));
      const editorConfig = ref<EditorConfigContract>({
          height: 100,
      });
      function formatDate(date: string): Date {
        return date ? Vue.prototype.$moment(date).format("DD MMM YYYY, h:mm a") : null;
      };
      function activeText(): void {
        loadingComment.value = true;
        dataBase.value.active = true;
        dataBase.value.text = "";
        setTimeout(() => {
          loadingComment.value = false;
        }, 1000);
        dataComment.value.close = true;
      }
      function cancelText(): void {
        if (dataBase.value.text.length > 0) {
          Vue.prototype.$q
            .dialog({
              ok: "Si",
              message: tr.value(`requestable.cms.message.undoComment`),
              cancel: "No",
              persistent: true,
            })
            .onOk(async () => {
              dataBase.value.active = false;
              dataBase.value.text = "";
              dataComment.value.close = false;
            })
            .onCancel(() => {});
        } else {
          dataBase.value.active = false;
          dataComment.value.close = false;
        }
      }
      function updateComment(type: string, id: number): void {
        try {
          const comment = comments.value.find((item) => item.id === id);
          if (comment) {
            if (type == "cancel") {
              cancelComment(comment);
            }
            if (type == "edit") {
              if (comment.comment !== comment.textEdit) {
                editComment(id, comment);
              } else {
                cancelComment(comment);
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
      function cancelComment(comment: commentsContract): void {
        if (comment.comment !== comment.textEdit) {
          Vue.prototype.$q
            .dialog({
              ok: tr.value('isite.cms.label.yes'),
              message: tr.value(`requestable.cms.message.undoComment`),
              cancel: tr.value('isite.cms.label.no'),
              persistent: true,
            })
            .onOk(async () => {
              comment.comment = comment.textEdit;
              comment.active = false;
              dataComment.value.close = false;
            })
            .onCancel(() => {});
        } else {
          comment.active = false;
          dataComment.value.close = false;
        }
      }
      function editComment(id: number, comment: commentsContract) {
        try {
          comment.loading = true;
          const params = {
            approved: comment.approved,
            commentableType: props.commentableType,
            commentableId: props.commentableId,
            comment: comment.comment,
            userId: comment.userId,
            is_internal: comment.is_internal,
            options: comment.options,
          };
          Vue.prototype.$crud
            .update(route.value, id, { ...params })
            .then((response) => {
              const commentUpdate = response.data;
              comment.updatedAt = commentUpdate.updatedAt;
              comment.loading = false;
              comment.active = false;
              comment.edit = false;
              Vue.prototype.$alert.info({
                message: tr.value(`requestable.cms.message.updateComment`),
              });
            })
            .catch((error) => {
              comment.loading = false;
              console.log(error);
              Vue.prototype.$alert.error({
                message: tr.value(`requestable.cms.message.updateNoComment`),
              });
            });
            dataComment.value.close = false;
        } catch (error) {
          console.log(error);
          dataComment.value.close = false;
        }
      }
      function activeEdit(id: number): void {
        try {
          dataComment.value.id = id;
          const comment = comments.value.find((item) => item.id === id);
          if (comment) {
            comment.textEdit = comment.comment;
            comment.active = true;
            dataComment.value.edit = true;
            dataComment.value.close = true;
          }
        } catch (error) {
          console.log(error);
          dataComment.value.edit = false;
          dataComment.value.close = false;
        }
      }
      async function addComment(): Promise<void> {
        try {
          const userId = proxy.$store.state.quserAuth.userId;
          dataBase.value.loading = true;
          const params = {
            approved: true,
            commentableType: props.commentableType,
            commentableId: props.commentableId,
            comment: dataBase.value.text,
            userId: userId,
            is_internal: false,
            options: null,
          };
          await Vue.prototype.$crud.create(route.value, params);
          await getCommentsList(props.commentableId);
          dataBase.value = { ...commentModel.value };
          await Vue.prototype.$alert.info({
            message: tr.value(`requestable.cms.message.savedComment`),
          });
        } catch (error) {
          console.log(error);
          dataBase.value.loading = false;
          Vue.prototype.$alert.error({
            message: tr.value(`requestable.cms.message.savedNoComment`),
          });
        }
      }
      async function deleteComment(id: number): Promise<void> {
          Vue.prototype.$q
          .dialog({
            ok: tr.value("isite.cms.label.delete"),
            message: tr.value("isite.cms.message.deleteRecord"),
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            Vue.prototype.$crud
              .delete(route.value, id)
              .then((response) => {
                comments.value = comments.value.filter(
                  (item) => item.id !== id
                );
                Vue.prototype.$alert.info({
                  message: tr.value("isite.cms.message.recordDeleted"),
                });
              })
              .catch((error) => {
                console.log(error);
                Vue.prototype.$alert.error({
                  message: tr.value("isite.cms.message.recordNoDeleted"),
                });
              });
          })
          .onCancel(() => {});
      }
      async function getCommentsList(commentableId: number): Promise<void> {
        try {
          const config = await configComment();
          loading.value = true;
          const params = {
            filter: {
              commentableType: commentableType.value,
              commentableId,
            },
            include: "userProfile",
          };
          Vue.prototype.$crud
            .get(route.value, params)
            .then((response) => {
              const data = response.data;
              comments.value = data.map((item) => ({
                ...item,
                active: false,
                loading: false,
                textEdit: "",
                icon: item.type ? config.data[item.type].icon : 'fa-regular fa-comment',
                color: item.type ? config.data[item.type].color: 'primary',
              }));
              loading.value = false;
            })
            .catch((error) => {
              loading.value = false;
              Vue.prototype.$alert.error({ message: error });
              console.log(error);
            });
        } catch (error) {
          console.log(error);
        }
      }
      async function configComment() {
        let routeParams = Vue.prototype.$helper.getInfoFromPermission(proxy.$route.meta.permission);
        if (!routeParams) return;
        let requestParams = {
          refresh: true,
          params: {
            filter: {
              configName: `${routeParams.module}.config.commentableConfig.requestable`
            }
          }
        }
        //Request
        return await Vue.prototype.$crud.index('apiRoutes.qsite.configs', requestParams);
      }
      getCommentsList(props.commentableId);
      onBeforeUnmount(async () => {
         if(dataComment.value.close) {
          if(dataComment.value.edit){
            await updateComment('edit', dataComment.value.id)
          } else {
            await addComment();
          }
         }
      })
      return {
        permisionComments,
        tr,
        dataBase,
        activeText,
        cancelText,
        updateComment,
        cancelComment,
        editComment,
        activeEdit,
        addComment,
        deleteComment,
        getCommentsList,
        textPlaceholder,
        editorConfig,
        formatDate,
        comments,
        loading,
        mainImage,
        loadingComment,
        files,
      };
}