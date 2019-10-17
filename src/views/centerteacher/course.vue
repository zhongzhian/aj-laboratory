<template>
  <div>
    <div class="table-condition-btnbar">
      <Button @click="addItem" size="small" class="condition-btn">新建章</Button>
      <!-- <Button @click="editItem" size="small" class="condition-btn">编辑</Button> -->
      <!-- <Button @click="delItem" size="small" class="condition-btn">删除</Button> -->
    </div>
    <div class="manage-content-right-content">
      <div :key="item" v-for="(item,index) in chapterDatas" class="course-chapter-item">
        <div class="course-chapter-item-header">
          <Icon class="course-chapter-item-icon" @click.stop="addSection(item)" type="android-add" />
          <Icon
            class="course-chapter-item-icon"
            style="background:#2d8cf0;"
            @click.stop="editChapter(item)"
            type="edit"
          />
          <Icon
            v-if="courseInfo.status === 0"
            class="course-chapter-item-icon"
            style="background:#e83b46;"
            @click.stop="delItem('chapter',item,index)"
            type="android-delete"
          />
          <!-- <Button icon="android-add" @click.stop="addSection(item)" size="small" ghost>新增节</Button>
          <Button icon="android-add" @click.stop="editChapter(item)" size="small" ghost>编辑章</Button>
          <Button
            icon="android-add"
            @click.stop="delItem('chapter',item,index)"
            size="small"
            ghost
          >删除章</Button>-->
          {{item.name+" - "+item.title}}
        </div>
        <div class="course-chapter-item-content">
          <div :key="section" v-for="(section,sindex) in item.sectionList" class="manage-collapse-p">
            <!-- <Icon
              class="course-chapter-item-icon"
              @click.stop="configTest(section,item)"
              type="edit"
            />-->
            <Icon
              class="course-chapter-item-icon"
              style="background:#2d8cf0;"
              @click.stop="editSection(section,item,sindex)"
              type="edit"
            />
            <Icon
              v-if="courseInfo.status === 0"
              class="course-chapter-item-icon"
              style="background:#e83b46;"
              @click.stop="delItem('section',section,sindex)"
              type="android-delete"
            />
            <!-- <Button icon="android-add" @click="editSection(section,item)" size="small" ghost>编辑节</Button>
            <Button
              icon="android-add"
              @click="delItem('section',section,sindex)"
              size="small"
              ghost
            >删除节</Button>-->
            {{section.name+" - "+section.title}}
            <p>
              <Button @click="configTest(section,item)" size="small" class="condition-btn">习题列表</Button>
              <Button @click="configTemplate(section,item)" size="small" class="condition-btn">试卷模版</Button>
            </p>
          </div>
        </div>
      </div>
    </div>
    <Drawer
      title="课程-章"
      v-model="showAddNew"
      width="720"
      :mask-closable="false"
      class-name="demo-drawer-style"
    >
      <div class="demo-drawer-content">
        <Form ref="formValidate" :model="newChapter" :rules="ruleValidate">
          <Row>
            <Col span="24">
              <FormItem label="名称" prop="name">
                <Input v-model="newChapter.name" size="small" placeholder="请输入名称" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <FormItem label="标题" prop="title">
                <Input v-model="newChapter.title" size="small" placeholder="请输入标题" />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="showAddNew = false">取消</Button>
        <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
      </div>
    </Drawer>
    <Drawer
      title="课程-章-节"
      v-model="showAddSection"
      width="720"
      :mask-closable="false"
      class-name="demo-drawer-style"
    >
      <div class="demo-drawer-content">
        <Form ref="sectionValidate" :model="newSection" :rules="ruleValidate">
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="名称" prop="name">
                <Input v-model="newSection.name" size="small" placeholder="请输入名称" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="标题" prop="title">
                <Input v-model="newSection.title" size="small" placeholder="请输入标题" />
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="视频">
                <Input v-model="newSection.video" size="small" readonly />
                <Upload
                  ref="upload"
                  :action="uploadAction"
                  :headers="headers"
                  :data="uploadData"
                  :show-upload-list="true"
                  :on-success="handleSuccess"
                  :format="['mp4']"
                  :max-size="1024*500"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  :before-upload="handleBeforeUpload"
                >
                  <Button icon="ios-cloud-upload-outline">上传视频</Button>
                </Upload>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="PDF文件">
                <Input v-model="newSection.pdf" size="small" readonly />
                <Upload
                  ref="upload"
                  :action="uploadAction"
                  :headers="headers"
                  :data="uploadData"
                  :show-upload-list="true"
                  :on-success="handleSuccess2"
                  :format="['pdf']"
                  :max-size="1024*50"
                  :on-format-error="handleFormatError2"
                  :on-exceeded-size="handleMaxSize2"
                  :before-upload="handleBeforeUpload"
                >
                  <Button icon="ios-cloud-upload-outline">上传PDF文件</Button>
                </Upload>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="内容" label-position="top">
            <!-- <Input v-show="false" type="textarea" v-model="newSection.content" :rows="4" /> -->
            <div id="course_editor" style="margin-top: 35px;"></div>
          </FormItem>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="showAddSection = false">取消</Button>
        <Button type="primary" @click="handleSubmit('sectionValidate')">保存</Button>
      </div>
    </Drawer>

    <Drawer
      title="习题列表"
      v-model="showChannel"
      width="720"
      :mask-closable="false"
      class-name="demo-drawer-style"
    >
      <div class="demo-drawer-content">
        <div class="table-condition-btnbar">
          <Button @click="addChannel" size="small" class="condition-btn">添加</Button>
          <Button @click="delChannel" size="small" class="condition-btn">删除</Button>
          <Button @click="getChannelDatas" size="small" class="condition-btn">刷新</Button>
        </div>
        <Table
          size="small"
          :columns="columns2"
          :data="channelDatas"
          @on-row-click="channelrowClick"
          @on-select="channelrowSelect"
        ></Table>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="showChannel = false">取消</Button>
        <Button type="primary" @click="showChannel = false">确定</Button>
      </div>
    </Drawer>

    <Drawer
      title="习题"
      v-model="showEditChannel"
      width="600"
      :mask-closable="false"
      class-name="demo-drawer-style"
    >
      <div class="demo-drawer-content">
        <Form ref="channelValidate" :model="channelObj" :rules="ruleValidate">
          <FormItem label="内容" prop="content" label-position="top">
            <Input type="textarea" v-model="channelObj.content" :rows="4" placeholder="请输入内容" />
          </FormItem>
          <FormItem label="题目类型" prop="exercisesType">
            <Select
              :disabled="channelObj.id"
              v-model="channelObj.exercisesType"
              placeholder="请选择题目类型"
            >
              <Option
                v-for="item in exercisesTypeDatas"
                :value="item.value"
                :key="item"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem
            v-if="(channelObj.exercisesType === 1) || (channelObj.exercisesType === 2)"
            label="选项"
            prop="options"
          >
            <RadioGroup v-model="optionType">
              <Radio :disabled="channelObj.id" label="文字"></Radio>
              <Radio :disabled="channelObj.id" label="图片"></Radio>
            </RadioGroup>
            <template v-if="optionType==='文字'">
              <div>
                A:
                <Input v-model="optionArr[0].A" size="small" placeholder="请输入A选项" />
              </div>
              <div>
                B:
                <Input v-model="optionArr[1].B" size="small" placeholder="请输入B选项" />
              </div>
              <div>
                C:
                <Input v-model="optionArr[2].C" size="small" placeholder="请输入C选项" />
              </div>
              <div>
                D:
                <Input v-model="optionArr[3].D" size="small" placeholder="请输入D选项" />
              </div>
            </template>
            <template v-if="optionType==='图片'">
              <div>
                A:
                <Upload
                  ref="upload"
                  :action="uploadAction"
                  :headers="headers"
                  :data="uploadData"
                  :show-upload-list="false"
                  :on-success="handleSuccessA"
                  :format="['jpg','jpeg','png']"
                  :max-size="1024"
                  :on-format-error="handleFormatErrorABCD"
                  :on-exceeded-size="handleMaxSizeABCD"
                  :before-upload="handleBeforeUpload"
                >
                  <img v-if="optionArr[0].A" :src="optionArr[0].A" class="form-user-img" />
                  <img
                    v-if="!optionArr[0].A"
                    src="static/images/noperson.png"
                    class="form-user-img"
                  />
                </Upload>
              </div>
              <div>
                B:
                <Upload
                  ref="upload"
                  :action="uploadAction"
                  :headers="headers"
                  :data="uploadData"
                  :show-upload-list="false"
                  :on-success="handleSuccessB"
                  :format="['jpg','jpeg','png']"
                  :max-size="1024"
                  :on-format-error="handleFormatErrorABCD"
                  :on-exceeded-size="handleMaxSizeABCD"
                  :before-upload="handleBeforeUpload"
                >
                  <img v-if="optionArr[1].B" :src="optionArr[1].B" class="form-user-img" />
                  <img
                    v-if="!optionArr[1].B"
                    src="static/images/noperson.png"
                    class="form-user-img"
                  />
                </Upload>
              </div>
              <div>
                C:
                <Upload
                  ref="upload"
                  :action="uploadAction"
                  :headers="headers"
                  :data="uploadData"
                  :show-upload-list="false"
                  :on-success="handleSuccessC"
                  :format="['jpg','jpeg','png']"
                  :max-size="1024"
                  :on-format-error="handleFormatErrorABCD"
                  :on-exceeded-size="handleMaxSizeABCD"
                  :before-upload="handleBeforeUpload"
                >
                  <img v-if="optionArr[2].C" :src="optionArr[2].C" class="form-user-img" />
                  <img
                    v-if="!optionArr[2].C"
                    src="static/images/noperson.png"
                    class="form-user-img"
                  />
                </Upload>
              </div>
              <div>
                D:
                <Upload
                  ref="upload"
                  :action="uploadAction"
                  :headers="headers"
                  :data="uploadData"
                  :show-upload-list="false"
                  :on-success="handleSuccessD"
                  :format="['jpg','jpeg','png']"
                  :max-size="1024"
                  :on-format-error="handleFormatErrorABCD"
                  :on-exceeded-size="handleMaxSizeABCD"
                  :before-upload="handleBeforeUpload"
                >
                  <img v-if="optionArr[3].D" :src="optionArr[3].D" class="form-user-img" />
                  <img
                    v-if="!optionArr[3].D"
                    src="static/images/noperson.png"
                    class="form-user-img"
                  />
                </Upload>
              </div>
            </template>
            <!-- <Input v-model="channelObj.options" size="small" placeholder="请输入选项" /> -->
          </FormItem>
          <FormItem v-if="channelObj.exercisesType === 1" label="正确答案" prop="answer">
            <RadioGroup v-model="channelObj.answer">
              <Radio label="A"></Radio>
              <Radio label="B"></Radio>
              <Radio label="C"></Radio>
              <Radio label="D"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem v-else-if="channelObj.exercisesType === 2" label="正确答案" prop="mulAnswer">
            <CheckboxGroup v-if="channelObj.exercisesType === 2" v-model="channelObj.mulAnswer">
              <Checkbox label="A"></Checkbox>
              <Checkbox label="B"></Checkbox>
              <Checkbox label="C"></Checkbox>
              <Checkbox label="D"></Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem v-else-if="channelObj.exercisesType === 4" label="正确答案" prop="answer">
            <RadioGroup v-model="channelObj.answer">
              <Radio label="正确"></Radio>
              <Radio label="错误"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem
            v-else
            label="正确答案"
            prop="answer"
          >
            <Input v-model="channelObj.answer" size="small" placeholder="请输入正确答案" />
          </FormItem>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="showEditChannel = false">取消</Button>
        <Button type="primary" @click="handleSubmit('channelValidate')">保存</Button>
      </div>
    </Drawer>

    <Drawer
      title="试卷模版"
      v-model="showTemplate"
      width="800"
      :mask-closable="false"
      class-name="demo-drawer-style"
    >
      <div class="demo-drawer-content">
        <Form ref="templateValidate" :model="templateObj" :rules="ruleValidate">
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="名称" prop="name">
                <Input v-model="templateObj.name" size="small" placeholder="请输入名称" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="总分" prop="score">
                <Input v-model="templateObj.score" disabled size="small" placeholder="请输入总分" />
              </FormItem>
            </Col>
          </Row>
          <FormItem label="说明" prop="description" label-position="top">
            <Input type="textarea" v-model="templateObj.description" :rows="4" placeholder="请输入说明" />
          </FormItem>
          <FormItem label="大题" label-position="top">
            <div>
              <Button @click="addBigTest" size="small" class="condition-btn">添加</Button>
              <!-- <Button @click="delBigTest" size="small" class="condition-btn">删除</Button> -->
            </div>
            <Table
              size="small"
              :columns="columns3"
              :data="templateObj.testPartTemplatePublicVoList"
              @on-select="bigtestrowSelect"
            ></Table>
          </FormItem>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="showTemplate = false">取消</Button>
        <Button type="primary" @click="handleSubmit('templateValidate')">保存</Button>
      </div>
    </Drawer>

    <Drawer
      title="试卷模版-大题"
      v-model="showBigTest"
      width="650"
      :mask-closable="false"
      class-name="demo-drawer-style"
    >
      <div class="demo-drawer-content">
        <Form ref="bigtestValidate" :model="bigTestObj" :rules="ruleValidate">
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="名称" prop="name">
                <Input v-model="bigTestObj.name" size="small" placeholder="请输入名称" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="序号" prop="serialNumber">
                <Input v-model="bigTestObj.serialNumber" size="small" placeholder="请输入序号" />
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="总分" prop="score">
                <Input v-model="bigTestObj.score" disabled size="small" placeholder="请输入总分" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="题目类型" prop="type">
                <Select
                  v-model="bigTestObj.type"
                  @on-change="bigtesttypeChange"
                  placeholder="请选择题目类型"
                >
                  <Option
                    v-for="item in exercisesTypeDatas"
                    :value="item.value"
                    :key="item"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="说明" prop="description" label-position="top">
            <Input type="textarea" v-model="bigTestObj.description" :rows="4" placeholder="请输入说明" />
          </FormItem>
          <FormItem label="小题" label-position="top">
            <div style="height:32px;"></div>
            <Table size="small" :columns="columns5" :data="bigTestObj.testExerciseTemplateList"></Table>
          </FormItem>
          <FormItem label="题库" label-position="top">
            <div style="height:32px;"></div>
            <Table size="small" :columns="columns4" :data="channelDatas"></Table>
          </FormItem>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="showBigTest = false">取消</Button>
        <Button type="primary" @click="handleSubmit('bigtestValidate')">保存</Button>
      </div>
    </Drawer>

    <Modal v-model="showDelete" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除提示</span>
      </p>
      <div style="text-align:center">
        <p>确定删除所选章节吗？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="delSubmit">删除</Button>
      </div>
    </Modal>
    <Modal v-model="showChannelDelete" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除提示</span>
      </p>
      <div style="text-align:center">
        <p>确定删除所选习题吗？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="delChannelSubmit">删除</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import API from "@/api";

export default {
  data() {
    return {
      picBasePath: API.picPath,
      uploadAction: API.uploadPath + API.index.upload_upload,
      headers: null,
      uploadData: {
        file: null,
        name: ""
      },

      optionType: "文字",
      optionArr: [{ A: "" }, { B: "" }, { C: "" }, { D: "" }],
      mulAnswer: [],
      showTemplate: false,
      showBigTest: false,
      templateObj: {
        chapterId: 0,
        chapterName: "string",
        chapterTitle: "string",
        courseId: 0,
        courseName: "string",
        description: "string",
        name: "string",
        score: 0,
        sectionId: 0,
        sectionName: "string",
        sectionTitle: "string",
        testPartTemplatePublicVoList: []
      },
      bigTestObj: {},
      bigTestIndex: -1,
      bigtestDatas: [],
      exercisesTypeDatas: [
        {
          value: 1,
          label: "单选题"
        },
        {
          value: 2,
          label: "多选题"
        },
        {
          value: 3,
          label: "填空题"
        },
        {
          value: 4,
          label: "判断题"
        },
        {
          value: 5,
          label: "问答题"
        },
        {
          value: 6,
          label: "计算题"
        }
      ],
      exercisesTypeDatasFormat: [
        "",
        "单选题",
        "多选题",
        "填空题",
        "判断题",
        "问答题",
        "计算题"
      ],
      columns2: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "内容",
          key: "content"
        },
        {
          title: "题目类型",
          key: "exercisesType",
          render: (h, params) => {
            let str = this.exercisesTypeDatasFormat[params.row.exercisesType];
            return h("span", str);
          }
        },
        {
          title: "正确答案",
          key: "answer"
        }
        // {
        //   title: "选项(选择题)",
        //   key: "options",
        //   render: (h, params) => {
        //     let str = "--";
        //     if (
        //       params.row.exercisesType === 1 ||
        //       params.row.exercisesType === 2
        //     ) {
        //       str = params.row.options;
        //     }
        //     return h("span", str);
        //   }
        // }
      ],
      columns3: [
        // {
        //   type: "selection",
        //   width: 60,
        //   align: "center"
        // },
        {
          title: "名称",
          key: "name"
        },
        {
          title: "序号",
          key: "serialNumber"
        },
        {
          title: "题目类型",
          key: "type",
          render: (h, params) => {
            let str = this.exercisesTypeDatasFormat[params.row.type];
            return h("span", str);
          }
        },
        {
          title: "分数",
          key: "score"
        },
        {
          title: "说明",
          key: "description"
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.bigtestrowClick(params.row, params.index);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.delBigtest(params.index);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      columns4: [
        {
          title: "内容",
          key: "exerciseContent"
        },
        {
          title: "题目类型",
          key: "exercisesType",
          render: (h, params) => {
            let str = this.exercisesTypeDatasFormat[params.row.exercisesType];
            return h("span", str);
          }
        },
        {
          title: "正确答案",
          key: "answer"
        },
        {
          title: "序号",
          key: "serialNumber",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h("input", {
              domProps: {
                value: params.row.serialNumber
              },
              class: "ivu-input ivu-input-small",
              on: {
                input: function(event) {
                  params.row.serialNumber = event.target.value;
                }
              }
            });
          }
        },
        {
          title: "分数",
          key: "score",
          width: 80,
          align: "center",
          render: (h, params) => {
            let that = this;
            return h("input", {
              domProps: {
                value: params.row.score
              },
              class: "ivu-input ivu-input-small",
              on: {
                input: event => {
                  params.row.score = event.target.value;
                }
              }
            });
          }
        },
        {
          title: "操作",
          key: "action",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      console.log("params", params);
                      let testindex = _.findIndex(
                        this.bigTestObj.testExerciseTemplateList,
                        ["exerciseId", params.row.id]
                      );
                      console.log("testindex", testindex);
                      if (testindex === -1) {
                        this.bigTestObj.testExerciseTemplateList.push(
                          params.row
                        );
                      } else {
                        this.bigTestObj.testExerciseTemplateList[testindex] =
                          params.row;
                        this.$set(
                          this.bigTestObj.testExerciseTemplateList,
                          testindex,
                          params.row
                        );
                      }
                      console.log(
                        "this.bigTestObj.testExerciseTemplateList",
                        this.bigTestObj.testExerciseTemplateList
                      );
                    }
                  }
                },
                "选取"
              )
            ]);
          }
        }
      ],
      columns5: [
        {
          title: "内容",
          key: "exerciseContent"
        },
        {
          title: "题目类型",
          key: "exercisesType",
          render: (h, params) => {
            let str = this.exercisesTypeDatasFormat[params.row.exercisesType];
            return h("span", str);
          }
        },
        {
          title: "正确答案",
          key: "answer"
        },
        {
          title: "序号",
          key: "serialNumber",
          width: 80,
          align: "center"
        },
        {
          title: "分数",
          key: "score",
          align: "center",
          width: 80
        },
        {
          title: "操作",
          key: "action",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.bigTestObj.testExerciseTemplateList.splice(
                        params.index,
                        1
                      );
                      console.log(
                        "this.bigTestObj.testExerciseTemplateList",
                        this.bigTestObj.testExerciseTemplateList
                      );
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      channelDatas: [],
      showChannel: false,
      channelselection: [],
      bigtestselection: [],
      testselection: [],
      editors: {
        course_editor: null,
        test_editor: null
      },
      editor: null,
      courseId: 0,
      courseInfo: null,
      chapterDatas: [],
      modal_loading: false,
      deleteType: null,
      deleteObj: null,
      deleteIndex: null,
      showAddNew: false,
      showEdit: false,
      showEditChannel: false,
      showDelete: false,
      showChannelDelete: false,
      newChapter: {
        name: "",
        title: "",
        courseId: 0,
        courseName: ""
      },
      editChapterObj: null,
      showAddSection: false,
      showEditSection: false,
      showDeleteSection: false,
      editSectionIndex: -1,
      newSection: {
        courseId: 0,
        courseName: "",
        chapterId: 0,
        chapterName: "",
        chapterTitle: "",
        content: "",
        name: "",
        title: ""
      },
      channelObj: {
        answer: "",
        chapterId: 0,
        chapterName: "",
        chapterTitle: "",
        content: "",
        courseId: 0,
        courseName: "",
        exercisesType: 1,
        options: "",
        sectionId: 0,
        sectionName: "",
        sectionTitle: ""
      },
      editSectionObj: null,
      ruleValidate: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],

        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
        options: [{ required: true, message: "请输入选项", trigger: "blur" }],
        answer: [
          { required: true, message: "请输入正确答案", trigger: "blur" }
        ],
        mulAnswer: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "请选择正确答案",
            trigger: "change"
          }
        ]
        // exercisesType: [{ required: true, message: "请选择题目类型", trigger: "change" }]
      }
    };
  },
  mounted() {
    let _this = this;
    this.headers = {
      Authorization: "Bearer " + this.$store.getters.token
    };
    let courseId = this.$route.query.id;
    if (courseId) {
      this.courseId = courseId;
      // this.getChapters();
      this.getCourse();
    }
    this.addEditor("course_editor");
  },
  methods: {
    addEditor(div) {
      let editor = new E("#" + div);
      // editor.customConfig.uploadImgShowBase64 = true; // 使用 base64 保存图片
      editor.customConfig.uploadImgServer = this.uploadAction; // 将图片上传到服务器上
      // 限制一次最多上传 5 张图片
      editor.customConfig.uploadImgMaxLength = 1;
      editor.customConfig.uploadImgHeaders = {
        Authorization: "Bearer " + this.$store.getters.token
      };

      editor.customConfig.uploadFileName = "file";
      editor.customConfig.uploadImgParams = {
        name: "aaa.jpg"
      };
      editor.customConfig.uploadImgHooks = {
        before: function(xhr, editor, files) {
          console.log("before", files);
          // 图片上传之前触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
          // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
          // return {
          //     prevent: true,
          //     msg: '放弃上传'
          // }
        },
        success: function(xhr, editor, result) {
          console.log("success", result);
          // 图片上传并返回结果，图片插入成功之后触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        fail: function(xhr, editor, result) {
          console.log("fail", result);
          // 图片上传并返回结果，但图片插入错误时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        error: function(xhr, editor) {
          console.log("error", xhr);
          // 图片上传出错时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },
        timeout: function(xhr, editor) {
          console.log("timeout", xhr);
          // 图片上传超时时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },

        // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
        // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
        customInsert: function(insertImg, result, editor) {
          console.log("customInsert", result);
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          // var url = result.url;
          if (result.code === 20000) {
            let splits = result.result.uploadFileName.split("|");
            let path = splits[1] ? splits[1] : splits[0];
            let fileurl = _this.picBasePath + path;
            insertImg(fileurl);
          }
          // insertImg(url);

          // result 必须是一个 JSON 格式字符串！！！否则报错
        }
      };
      editor.customConfig.menus = [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "quote", // 引用
        "emoticon", // 表情
        "image", // 插入图片
        "table", // 表格
        // "video", // 插入视频
        // "code", // 插入代码
        "undo", // 撤销
        "redo" // 重复
      ];
      editor.create();
      this.editors[div] = editor;
    },
    addBigTest() {
      this.bigTestObj = {
        description: "",
        name: "",
        score: 0,
        serialNumber: this.templateObj.testPartTemplatePublicVoList.length + 1,
        type: 1,
        testExerciseTemplateList: []
      };
      this.bigTestIndex = -1;
      this.getChannelDatas(this.bigTestObj.type);
      this.showBigTest = true;
    },
    bigtesttypeChange(name) {
      console.log("change name", name);
      this.bigTestObj.testExerciseTemplateList = [];
      this.getChannelDatas(name);
    },
    bigtestrowSubmit() {
      if (this.bigTestObj.testExerciseTemplateList.length < 1) {
        this.$Message.error("请从题库中选取习题");
        return;
      }
      let score = 0;
      this.bigTestObj.testExerciseTemplateList.forEach(t => {
        let intscore = parseInt(t.score);
        if (intscore) {
          score += intscore;
        }
      });
      this.bigTestObj.score = score;
      // this.bigTestObj.testExerciseTemplateList = this.testselection;
      if (this.bigTestIndex === -1) {
        this.templateObj.testPartTemplatePublicVoList.push(this.bigTestObj);
      } else {
        this.templateObj.testPartTemplatePublicVoList[
          this.bigTestIndex
        ] = this.bigTestObj;
      }
      // console.log("this.testselection",this.testselection);
      // console.log("this.channelDatas",this.channelDatas);
      console.log(
        "this.bigTestObj.testExerciseTemplateList",
        this.bigTestObj.testExerciseTemplateList
      );
      console.log("this.templateObj", this.templateObj);

      this.showBigTest = false;
    },
    testrowSelect(selection, row) {
      this.testselection = selection;
    },
    bigtestrowSelect(selection, row) {
      this.bigtestselection = selection;
    },
    delBigtest(index) {
      this.templateObj.testPartTemplatePublicVoList.splice(index, 1);
    },
    bigtestrowClick(item, index) {
      this.bigTestObj = item;
      this.bigTestIndex = index;
      this.showBigTest = true;
    },
    getTemplateDatas() {
      this.axios
        .get(`${API.index.testTemplate_bySid}` + this.newSection.id)
        .then(result => {
          if (result.code === 20000) {
            this.templateObj = result.result;
            console.log("this.templateObj....get", this.templateObj);
          }
        });
    },
    tamplateSubmit() {
      let score = 0;
      this.templateObj.testPartTemplatePublicVoList.forEach(t => {
        let intscore = parseInt(t.score);
        if (intscore) {
          score += intscore;
        }
      });
      this.templateObj.score = score;
      let method = "post";
      if (this.templateObj.id) {
        method = "put";
      }
      console.log("this.templateObj", this.templateObj);
      this.axios({
        method: method,
        url: API.index.testTemplate,
        data: this.templateObj,
        showSpin: false
      })
        .then(result => {
          if (result.code === 20000) {
            this.showTemplate = false;
          }
        })
        .catch(err => {
          this.$Message.error("保存失败");
        });
    },
    configTemplate(item, chapter) {
      this.editChapterObj = chapter;
      this.newSection = item;
      this.templateObj = {
        chapterId: this.editChapterObj.id,
        chapterName: this.editChapterObj.name,
        chapterTitle: this.editChapterObj.title,
        courseId: this.courseInfo.id,
        courseName: this.courseInfo.name,
        sectionId: this.newSection.id,
        sectionName: this.newSection.name,
        sectionTitle: this.newSection.title,
        description: "",
        name: "",
        score: 0,
        testPartTemplatePublicVoList: []
      };
      this.getChannelDatas();
      this.getTemplateDatas();
      this.showTemplate = true;
    },
    configTest(item, chapter) {
      this.editChapterObj = chapter;
      this.newSection = item;
      this.getChannelDatas();
      this.showChannel = true;
    },
    addChannel() {
      this.channelObj = {
        answer: "",
        chapterId: this.editChapterObj.id,
        chapterName: this.editChapterObj.name,
        chapterTitle: this.editChapterObj.title,
        content: "",
        courseId: this.courseInfo.id,
        courseName: this.courseInfo.name,
        exercisesType: 1,
        options: '[{"A":""},{"B":""},{"C":""},{"D":""}]',
        sectionId: this.newSection.id,
        sectionName: this.newSection.name,
        sectionTitle: this.newSection.title,
        mulAnswer: []
      };
      this.optionType = "文字";
      this.optionArr = JSON.parse(this.channelObj.options);
      this.mulAnswer = [];
      this.showEditChannel = true;
    },
    addChannelSubmit() {
      let method = "post";
      if (this.channelObj.id) {
        method = "put";
      }
      if (
        this.channelObj.exercisesType === 1 ||
        this.channelObj.exercisesType === 2
      ) {
        if (
          this.optionArr[0].A &&
          this.optionArr[1].B &&
          this.optionArr[2].C &&
          this.optionArr[3].D
        ) {
          // // 编辑成img
          // if(this.optionType === '图片'){
          //   this.optionArr[0].A = '<img src="'+this.optionArr[0].A+'" />';
          //   this.optionArr[1].B = '<img src="'+this.optionArr[1].B+'" />';
          //   this.optionArr[2].C = '<img src="'+this.optionArr[2].C+'" />';
          //   this.optionArr[3].D = '<img src="'+this.optionArr[3].D+'" />';
          // }
          this.channelObj.options = JSON.stringify(this.optionArr);
        } else {
          this.$Message.error("请输入选项内容");
          return;
        }
        if (this.channelObj.exercisesType === 2) {
          console.log("answer", this.channelObj.mulAnswer);
          this.channelObj.answer = this.channelObj.mulAnswer.join(",");
        }
      } else {
        this.channelObj.options =
          '[{"A": "1"},{"B": "2"},{"C": "3"},{"D": "4"}]';
      }
      if (this.channelObj.exercisesType === 4) {
        this.channelObj.answer = this.channelObj.answer === "正确" ? "A" : "B";
      }
      // return;
      this.axios({
        method: method,
        url: API.index.exercise,
        data: this.channelObj,
        showSpin: false
      })
        .then(result => {
          if (result.code === 20000) {
            this.showEditChannel = false;
            this.getChannelDatas();
          }
        })
        .catch(err => {
          this.$Message.error("保存失败");
        });
    },
    delChannel() {
      if (this.channelselection.length < 1) {
        this.$Message.error("请先选择要删除的设备");
        return;
      }
      this.showChannelDelete = true;
    },
    delChannelSubmit() {
      let ids = [];
      ids = this.channelselection.map(s => s.id);
      this.modal_loading = true;

      this.axios({
        method: "delete",
        url: API.index.exercise,
        data: ids,
        showSpin: false
      })
        .then(result => {
          if (result.code === 20000) {
            this.showChannelDelete = false;
            this.modal_loading = false;
            this.getChannelDatas();
          }
        })
        .catch(err => {
          this.modal_loading = false;
          this.$Message.error("删除失败");
        });
    },
    channelrowSelect(selection, row) {
      this.channelselection = selection;
    },
    channelrowClick(item, index) {
      this.channelObj = item;
      this.optionArr = JSON.parse(this.channelObj.options);
      this.optionType =
        this.optionArr[0].A.indexOf("http://") === 0 ? "图片" : "文字";
      if (this.channelObj.exercisesType === 2) {
        this.channelObj.mulAnswer = this.channelObj.answer.split(",");
      }
      if (this.channelObj.exercisesType === 4) {
        this.channelObj.answer =
          this.channelObj.answer === "A" ? "正确" : "错误";
      }
      this.showEditChannel = true;
    },
    getChannelDatas(type) {
      let params = {
        searchParas: {
          conditions: [
            {
              name: "sectionId",
              op: "eq",
              type: "int",
              value: this.newSection.id
            }
          ],
          logic: "and"
        }
      };
      if (type) {
        params.searchParas.conditions.push({
          name: "exercisesType",
          op: "eq",
          type: "int",
          value: type
        });
      }
      this.axios.post(`${API.index.exercise_list}`, params).then(result => {
        if (result.code === 20000) {
          this.channelDatas = result.result.list.map((c, index) => {
            return {
              ...c,
              exerciseId: c.id,
              exerciseContent: c.content,
              serialNumber: index + 1,
              score: 1
            };
          });
          console.log("this.channelDatas", this.channelDatas);
        }
      });
    },
    handleSubmit(name) {
      let _this = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          // this.$store.dispatch("register", this.formValidate);
          switch (name) {
            case "formValidate":
              _this.addSubmit();
              break;
            case "sectionValidate":
              _this.addSectionSubmit();
              break;
            case "channelValidate":
              _this.addChannelSubmit();
              break;
            case "templateValidate":
              _this.tamplateSubmit();
              break;
            case "bigtestValidate":
              _this.bigtestrowSubmit();
              break;
            case "testValidate":
              _this.testrowSubmit();
              break;
          }
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    delItem(type, item, index) {
      this.deleteType = type;
      this.deleteObj = item;
      this.deleteIndex = index;
      this.showDelete = true;
    },
    delSubmit() {
      let url =
        this.deleteType === "chapter" ? API.index.chapter : API.index.section;
      let ids = [this.deleteObj.id];
      this.modal_loading = true;

      this.axios({
        method: "delete",
        url: url,
        data: ids,
        showSpin: false
      })
        .then(result => {
          if (result.code === 20000) {
            this.showDelete = false;
            this.modal_loading = false;
            // this.getChapters();
            this.getCourse();
            // if (this.deleteType === "chapter") {
            //   this.chapterDatas.splice(this.deleteIndex, 1);
            // }
          }
        })
        .catch(err => {
          this.modal_loading = false;
          this.$Message.error("删除失败");
        });
    },
    // chapter
    addItem() {
      this.newChapter = {
        name: "",
        title: "",
        courseId: this.courseInfo.id,
        courseName: this.courseInfo.name
      };
      this.showAddNew = true;
    },
    editChapter(item) {
      this.newChapter = item;
      this.showAddNew = true;
    },
    addSubmit() {
      let method = "post";
      if (this.newChapter.id) {
        method = "put";
      }
      this.axios({
        method: method,
        url: API.index.chapter,
        data: this.newChapter,
        showSpin: false
      })
        .then(result => {
          if (result.code === 20000) {
            this.showAddNew = false;
            // this.getTableDatas();
            if (!this.newChapter.id) {
              result.result.sectionList = [];
              this.chapterDatas.push(result.result);
            }
          }
        })
        .catch(err => {
          this.$Message.error("保存失败");
        });
    },
    // section
    addSection(item) {
      this.editChapterObj = item;
      this.newSection = {
        courseId: this.courseInfo.id,
        courseName: this.courseInfo.name,
        chapterId: item.id,
        chapterName: item.name,
        chapterTitle: item.title,
        content: "",
        pdf: "",
        vedio: "",
        name: "",
        title: ""
      };
      this.setEdit();
      this.showAddSection = true;
    },
    editSection(item, chapter, index) {
      this.axios({
        method: "get",
        url: API.index.section + "/" + item.id,
        showSpin: false
      }).then(result => {
        if (result.code === 20000) {
          this.editChapterObj = chapter;
          this.newSection = result.result;
          this.editSectionIndex = index;
          this.setEdit();
          this.showAddSection = true;
        }
      });
    },
    setEdit() {
      this.editors["course_editor"].txt.html(this.newSection.content);
    },
    addSectionSubmit() {
      this.newSection.content = this.editors["course_editor"].txt.html();
      let method = "post";
      if (this.newSection.id) {
        method = "put";
      }
      this.axios({
        method: method,
        url: API.index.section,
        data: this.newSection,
        showSpin: false
      })
        .then(result => {
          if (result.code === 20000) {
            this.showAddSection = false;
            // this.getTableDatas();
            if (!this.newSection.id) {
              this.editChapterObj.sectionList.push(result.result);
            } else {
              // this.editChapterObj.loadSection = false;
              // this.editChapterObj.show = false;
              this.getSections(this.editChapterObj);
            }
          }
        })
        .catch(err => {
          this.$Message.error("保存失败");
        });
    },
    getSections(item) {
      // item.show = !item.show;
      // if (item.show && !item.loadSection) {
      //   let params = {
      //     searchParas: {
      //       conditions: [
      //         {
      //           name: "chapterId",
      //           op: "eq",
      //           type: "int",
      //           value: item.id
      //         }
      //       ],
      //       logic: "and"
      //     }
      //   };
      //   this.axios.post(`${API.index.section_list}`, params).then(result => {
      //     if (result.code === 20000) {
      //       item.sectionList = result.result.list;
      //       item.loadSection = true;
      //     }
      //   });
      // }

      let params = {
        searchParas: {
          conditions: [
            {
              name: "chapterId",
              op: "eq",
              type: "int",
              value: item.id
            }
          ],
          logic: "and"
        }
      };
      this.axios.post(`${API.index.section_list}`, params).then(result => {
        if (result.code === 20000) {
          item.sectionList = result.result.list;
        }
      });
    },
    getChapters() {
      let params = {
        searchParas: {
          conditions: [
            {
              name: "courseId",
              op: "eq",
              type: "int",
              value: this.courseId
            }
          ],
          logic: "and"
        }
      };
      this.axios.post(`${API.index.chapter_list}`, params).then(result => {
        if (result.code === 20000) {
          this.chapterDatas = result.result.list.map(c => {
            c.sectionList = [];
            // c.show = false;
            // c.loadSection = false;
            return c;
          });
        }
      });
    },
    getCourse() {
      this.axios
        .get(`${API.index.course_getDetail + "/"}` + this.courseId)
        .then(result => {
          if (result.code === 20000) {
            this.courseInfo = result.result;
            this.chapterDatas = result.result.chapterList;
            // this.newChapter.courseId = result.result.id;
            // this.newChapter.courseName = result.result.name;
            // this.newSection.courseId = result.result.id;
            // this.newSection.courseName = result.result.name;
          }
        });
    },
    handleSuccess(res, file, fileList) {
      console.log("handleSuccess .. res", res);
      if ((res.code === 20000)) {
        let splits = res.result.uploadFileName.split("|");
        let path = splits[1] ? splits[1] : splits[0];
        file.url = this.picBasePath + path;
        this.newSection.video = file.url;
        // this.picList.unshift(file);
        // this.picList = [...this.picList];
        // console.log("handleSuccess1 .. this.picList", this.picList);
      } else if (res.code === 50401) {
        console.log("this.$route.name....", this.$route.name);
        this.$router.push({
          name: "login",
          query: {
            name: this.$route.name
          }
        });
      }else{
          this.$Message.error(res.message);
      }
    },
    handleSuccess2(res, file, fileList) {
      console.log("handleSuccess .. res", res);
      if ((res.code === 20000)) {
        let splits = res.result.uploadFileName.split("|");
        let path = splits[1] ? splits[1] : splits[0];
        file.url = this.picBasePath + path;
        this.newSection.pdf = file.url;
        // this.picList.unshift(file);
        // this.picList = [...this.picList];
        // console.log("handleSuccess1 .. this.picList", this.picList);
      } else if (res.code === 50401) {
        console.log("this.$route.name....", this.$route.name);
        this.$router.push({
          name: "login",
          query: {
            name: this.$route.name
          }
        });
      }else{
          this.$Message.error(res.message);
      }
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "视频文件 " + file.name + " 格式错误, 目前仅支持mp4格式."
      });
    },
    handleFormatError2(file) {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "PDF文件 " + file.name + " 格式错误, 目前仅支持PDF格式."
      });
    },
    handleFormatErrorABCD(file) {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件 " + file.name + " 格式错误, 目前仅支持jpg,jpeg,png格式."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件过大",
        desc: "视频文件  " + file.name + " 不能大于500M."
      });
    },
    handleMaxSize2(file) {
      this.$Notice.warning({
        title: "文件过大",
        desc: "PDF文件  " + file.name + " 不能大于50M."
      });
    },
    handleMaxSizeABCD(file) {
      this.$Notice.warning({
        title: "文件过大",
        desc: "上传的答案图片不能大于1M."
      });
    },
    handleBeforeUpload(file) {
      this.uploadData.file = file;
      this.uploadData.name = file.name;
    },
    handleSuccessA(res, file, fileList) {
      if ((res.code === 20000)) {
        let splits = res.result.uploadFileName.split("|");
        let path = splits[1] ? splits[1] : splits[0];
        file.url = this.picBasePath + path;
        this.optionArr[0].A = file.url;
      } else if (res.code === 50401) {
        console.log("this.$route.name....", this.$route.name);
        this.$router.push({
          name: "login",
          query: {
            name: this.$route.name
          }
        });
      }else{
          this.$Message.error(res.message);
      }
    },
    handleSuccessB(res, file, fileList) {
      if ((res.code === 20000)) {
        let splits = res.result.uploadFileName.split("|");
        let path = splits[1] ? splits[1] : splits[0];
        file.url = this.picBasePath + path;
        this.optionArr[1].B = file.url;
      } else if (res.code === 50401) {
        console.log("this.$route.name....", this.$route.name);
        this.$router.push({
          name: "login",
          query: {
            name: this.$route.name
          }
        });
      }else{
          this.$Message.error(res.message);
      }
    },
    handleSuccessC(res, file, fileList) {
      if ((res.code === 20000)) {
        let splits = res.result.uploadFileName.split("|");
        let path = splits[1] ? splits[1] : splits[0];
        file.url = this.picBasePath + path;
        this.optionArr[2].C = file.url;
      } else if (res.code === 50401) {
        console.log("this.$route.name....", this.$route.name);
        this.$router.push({
          name: "login",
          query: {
            name: this.$route.name
          }
        });
      }else{
          this.$Message.error(res.message);
      }
    },
    handleSuccessD(res, file, fileList) {
      if ((res.code === 20000)) {
        let splits = res.result.uploadFileName.split("|");
        let path = splits[1] ? splits[1] : splits[0];
        file.url = this.picBasePath + path;
        this.optionArr[3].D = file.url;
      } else if (res.code === 50401) {
        console.log("this.$route.name....", this.$route.name);
        this.$router.push({
          name: "login",
          query: {
            name: this.$route.name
          }
        });
      }else{
          this.$Message.error(res.message);
      }
    }
  }
};
</script>
<style>
</style>

<style lang="less" scoped>
.manage-content-right-title {
  border-bottom: 1px solid #ccc;
  font-size: 16px;
  line-height: 30px;
}
// .manage-content-right-content {
//   margin-top: 10px;
// }
// .manage-collapse-p {
//   line-height: 30px;
//   border-bottom: 2px #ccc dotted;
// }
.chapter-toolbar {
  position: relative;
}
.course-chapter-item {
  margin-top: 10px;
}
.course-chapter-item-icon {
  margin-right: 5px;
  cursor: pointer;
  border: 1px solid #fff;
  padding: 2px;
  width: 18px;
  height: 18px;
  text-align: center;
  background: #58b736;
  color: #fff;
  border-radius: 3px;
}
.course-chapter-item-header {
  background: #d9ead6;
  height: 30px;
  line-height: 30px;
  // color: #666;
  // cursor: pointer;
  position: relative;
  padding: 0 10px;
}
.course-chapter-item-content {
  color: #495060;
  padding: 0 16px;
  background-color: #fff;
  margin: 10px 0;
}

.course-chapter-action-icon {
  border: 1px solid #fff;
  padding: 2px;
  width: 18px;
  height: 18px;
  text-align: center;
  background: #58b736;
  color: #fff;
  border-radius: 3px;
}
</style>
