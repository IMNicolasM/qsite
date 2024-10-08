<template>
  <div v-if="permisionComments.index">
    <div>
      <q-list dense class="list-comments">
          <q-item
            class="tw-my-3"
            style="padding: 0px !important"
            v-if="permisionComments.create"
          >
            <q-item-section top avatar>
              <q-avatar size="md" color="grey-4" class="tw-ml-2">
                <img :src="`${dataBase.avatar}`" />
              </q-avatar>
            </q-item-section>
            <q-item-section
              v-if="!dataBase.active"
              class="tw-mr-4 tw-cursor-pointer"
            >
              <q-card flat bordered>
                <q-card-section
                  class="tw-py-2 tw-cursor-pointer text-grey-6"
                  v-html="textPlaceholder"
                  @click="activeText()"
                  :title="i18n.tr(`isite.cms.label.edit`)"
                />
              </q-card>
            </q-item-section>
            <q-item-section class="bg-grey-1 shadow-1 tw-p-2" v-else>
              <div v-if="!loadingComment">
                  <CKEditor
                    v-model="dataBase.text"
                    :config="editorConfig"
                />
                <div>
                  <dynamic-field
                    :field="files"
                    class="tw-py-2 tw-hidden"
                  />
                </div>
                <div class="flex justify-between">
                  <div class="tw-mt-2 tw-space-x-2">
                    <q-btn
                      :loading="dataBase.loading"
                      :disable="dataBase.text == ''"
                      @click="addComment()"
                      rounded
                      size="md"
                      :label="i18n.tr(`isite.cms.label.save`)"
                      color="primary"
                      no-caps
                    />
                    <q-btn
                      flat
                      size="md"
                      @click="cancelText()"
                      padding="4px 4px"
                      icon="fa fa-close"
                      color="primary"
                    />
                  </div>
                </div>
              </div>
              <div
                v-if="loadingComment"
                class="tw-py-8"
              >
                <q-spinner
                  color="primary"
                  size="3em"
                  :thickness="2"
                  class="tw-mx-auto"
                />
              </div>
            </q-item-section>
          </q-item>
          <q-item v-if="permisionComments.index">
            <q-item-section v-if="!loading">
              <q-timeline class="grey-4 timeline-ctn">
                <q-timeline-entry
                  v-for="(item, index, itemKey) in comments"
                  :key="itemKey"
                  :icon="item.icon ? item.icon : 'fa-regular fa-comment'"
                  :color="item.color"
                >
                 <div class="tw-p-4 tw-rounded-md tw-bg-white">
                    <div>
                      <h4
                      class="tw-text-sm"
                      v-if="item.userProfile"
                    >
                      <strong v-if="!Boolean(item.internal)">
                        {{ item.userProfile.fullName }}
                      </strong>
                      <small v-if="item.updatedAt || item.createdAt">
                        {{ formatDate(item.updatedAt|| item.createdAt) }}
                      </small>
                    </h4>
                    <CKEditor
                      v-model="item.comment"
                      v-if="item.active"
                    ></CKEditor>
                    <div v-else>
                      <div
                       class="tw-flex tw-border tw-p-2"
                       :class="{'tw-cursor-pointer': !Boolean(item.internal) }"
                      >
                        <div class="tw-w-11/12">
                          <div
                            v-html="item.comment"
                            v-if="permisionComments.index"
                            @click="!Boolean(item.internal) ? activeEdit(item.id): null"
                          />
                        </div>
                        <div class="tw-text-right tw-text-xs tw-w-1/12">
                          <q-btn
                            flat
                            v-if="permisionComments.destroy && !Boolean(item.internal)"
                            class="tw-text-gray-500"
                            icon="fa-light fa-trash"
                            size="xs"
                            @click="deleteComment(item.id)"
                          >
                            <q-tooltip>{{
                                i18n.tr(`isite.cms.label.delete`)
                              }}</q-tooltip>
                          </q-btn>
                        </div>
                      </div>
                    </div>
                    <div class="flex justify-between" v-if="item.active">
                      <div class="tw-mt-2 tw-space-x-2">
                        <q-btn
                          :disable="
                            item.comment == '' || item.comment == item.textEdit
                          "
                          :loading="item.loading"
                          @click="updateComment('edit', item.id)"
                          rounded
                          size="md"
                          :label="i18n.tr(`isite.cms.label.update`)"
                          color="primary"
                          no-caps
                        />
                        <q-btn
                          flat
                          size="md"
                          @click="updateComment('cancel', item.id)"
                          padding="4px 4px"
                          icon="fa fa-close"
                          color="primary"
                        >
                          <q-tooltip>{{
                            i18n.tr(`isite.cms.label.cancel`)
                          }}</q-tooltip>
                        </q-btn>
                      </div>
                    </div>
                    </div>
                </div>
                </q-timeline-entry>
              </q-timeline>
            </q-item-section>
            <div v-if="loading" class="tw-my-10">
              <inner-loading :visible="loading"/>
            </div>
          </q-item>
        </q-list>
    </div>
  </div>
</template>

<script lang="ts">
import Vue,
{ defineComponent, computed, ref}
from "vue";
import CKEditor from "modules/qsite/_components/master/ckEditor.vue";
import {
  apiRouteDefault,
  commentableTypeDefault,
  permissionsCommentsDefault,
} from "modules/qsite/_components/master/comments/contracts/comments";
import useComments from './uses/useComments'
export default defineComponent({
   components: { CKEditor },
   props: {
    commentableId: {
      type: Number,
      required: true,
    },
    commentableType: {
      type: String,
      default: () => commentableTypeDefault,
    },
    apiRoute: {
      type: String,
      default: () => apiRouteDefault,
    },
    permisionComments: {
      type: String,
      default: () => permissionsCommentsDefault,
    }
  },
  setup(props) {
    return {...useComments(props)}
  },
});
</script>

<style>
.timeline-ctn .q-timeline__dot:after {
  @apply tw-text-gray-500;
  width: 1px;
}
</style>
