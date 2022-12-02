<template>
  <div>
    <div class="table-condition-btnbar">
      问卷调查
      <template v-if="templateDatas2.length === 0">
        <Button @click="addTemplate2" size="small" class="condition-btn"
          >创建</Button
        >
      </template>
    </div>
    <div>
      <Table
        size="small"
        :columns="templateColumns2"
        :data="templateDatas2"
        @on-row-click="templaterowClick2"
      ></Table>
    </div>
    <div class="table-condition-btnbar" style="margin-top:20px;">
      实验报告
      <Button @click="addTemplate" size="small" class="condition-btn"
        >添加</Button
      >
      <!-- <Button @click="editItem" size="small" class="condition-btn">编辑</Button> -->
      <Button @click="delTemplate" size="small" class="condition-btn"
        >删除</Button
      >
      <Button @click="searchData" size="small" class="condition-btn"
        >刷新</Button
      >
    </div>
    <div>
      <Table
        size="small"
        :columns="templateColumns"
        :data="templateDatas"
        @on-row-click="templaterowClick"
        @on-select="templaterowSelect"
      ></Table>
    </div>
    <div id="tempEditorDiv" style="display:none;"></div>
    <Drawer
      title="问卷调查模版"
      v-model="showTemplate2"
      width="80%"
      :mask-closable="false"
      class-name="demo-drawer-style"
    >
      <div v-if="templateObj" class="demo-drawer-content">
        <Form ref="templateValidate" :model="templateObj" :rules="ruleValidate">
          <FormItem label="名称" prop="name">
            <Input
              v-model="templateObj.name"
              size="small"
              placeholder="请输入名称"
            />
          </FormItem>
          <FormItem label="说明" prop="description" label-position="top">
            <Input
              type="textarea"
              v-model="templateObj.description"
              :rows="4"
              placeholder="请输入说明"
            />
          </FormItem>
          <FormItem label="问题" label-position="top">
            <div style="height:32px;"></div>
            <Table
              size="small"
              :columns="testColumns2"
              :data="templateObj.testExerciseTemplateList"
            >
              <template slot-scope="{ row, index }" slot="action">
                <div
                  style="max-height:100px;overflow:auto;"
                  v-html="row.exerciseContent"
                ></div> </template
            ></Table>
          </FormItem>
          <FormItem label="题库" label-position="top">
            <div style="height:32px;"></div>
            <Table
              size="small"
              :columns="channelColumns2"
              :data="questionChannelDatas"
            >
              <template slot-scope="{ row, index }" slot="action">
                <div
                  style="max-height:100px;overflow:auto;"
                  v-html="row.content"
                ></div> </template
            ></Table>
          </FormItem>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="showTemplate2 = false"
          >取消</Button
        >
        <Button type="primary" @click="handleSubmit('templateValidate')"
          >保存</Button
        >
      </div>
    </Drawer>

    <Drawer
      title="实验报告模版"
      v-model="showTemplate"
      width="80%"
      :mask-closable="false"
      class-name="demo-drawer-style"
    >
      <div v-if="templateObj" class="demo-drawer-content">
        <Form ref="templateValidate" :model="templateObj" :rules="ruleValidate">
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="名称" prop="name">
                <Input
                  v-model="templateObj.name"
                  size="small"
                  placeholder="请输入名称"
                />
              </FormItem>
              <!-- <FormItem label="试卷类型" prop="testType">
                <Select
                  :disabled="templateObj.id"
                  v-model="templateObj.testType"
                  placeholder="请选择试卷类型"
                >
                  <Option
                    v-for="item in testTypeDatas"
                    :value="item.value"
                    :key="item"
                    >{{ item.label }}</Option
                  >
                </Select>
              </FormItem> -->
            </Col>
            <Col span="12">
              <FormItem label="总分" prop="score">
                <Input
                  v-model="templateObj.score"
                  disabled
                  size="small"
                  placeholder="请输入总分"
                />
              </FormItem>
            </Col>
          </Row>
          <FormItem label="说明" prop="description" label-position="top">
            <Input
              type="textarea"
              v-model="templateObj.description"
              :rows="4"
              placeholder="请输入说明"
            />
          </FormItem>
          <template v-if="templateObj.testType === 1">
            <div class="table-condition-btnbar">各分项分数设置</div>
            <FormItem
              v-for="item in templateObj.testSubsectionTemplatePublicVoList"
              :value="item"
              :key="item"
              :label="item.name"
              prop="score"
            >
              <InputNumber
                :max="100"
                :min="0"
                style="width:200px;"
                v-model="item.score"
                placeholder="请输入该项分数"
              ></InputNumber>
            </FormItem>
            <div class="table-condition-btnbar">实验报告试题设置</div>
            <FormItem label="大题" label-position="top">
              <div>
                <Button @click="addBigTest" size="small" class="condition-btn"
                  >添加</Button
                >
              </div>
              <Table
                size="small"
                :columns="bigtestColumns"
                :data="subsectionObj.testPartTemplatePublicVoList"
                @on-select="bigtestrowSelect"
              ></Table>
            </FormItem>
          </template>
          <template v-if="templateObj.testType === 2">
            <!-- <FormItem label="大题" label-position="top">
              <div>
                <Button @click="addBigTest" size="small" class="condition-btn"
                  >添加</Button
                >
              </div>
              <Table
                size="small"
                :columns="channelColumns"
                :data="channelDatas"
                @on-select="bigtestrowSelect"
              ></Table>
            </FormItem> -->
          </template>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="showTemplate = false"
          >取消</Button
        >
        <Button type="primary" @click="handleSubmit('templateValidate')"
          >保存</Button
        >
      </div>
    </Drawer>

    <Drawer
      title="实验报告模版-大题"
      v-model="showBigTest"
      width="800"
      :mask-closable="false"
      class-name="demo-drawer-style"
    >
      <div v-if="bigTestObj" class="demo-drawer-content">
        <Form ref="bigtestValidate" :model="bigTestObj" :rules="ruleValidate">
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="名称" prop="name">
                <Input
                  v-model="bigTestObj.name"
                  size="small"
                  placeholder="请输入名称"
                />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="序号" prop="serialNumber">
                <Input
                  v-model="bigTestObj.serialNumber"
                  size="small"
                  placeholder="请输入序号"
                />
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="总分" prop="score">
                <Input
                  v-model="bigTestObj.score"
                  size="small"
                  placeholder="请输入大题总分"
                />
                <!-- <InputNumber
                  :max="subsectionObj.score"
                  :min="1"
                  v-model="bigTestObj.score"
                  placeholder="请输入大题总分"
                ></InputNumber> -->
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
                    >{{ item.label }}</Option
                  >
                </Select>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="说明" prop="description" label-position="top">
            <Input
              type="textarea"
              v-model="bigTestObj.description"
              :rows="4"
              placeholder="请输入说明"
            />
          </FormItem>
          <FormItem label="小题" label-position="top">
            <div style="height:32px;"></div>
            <Table
              size="small"
              :columns="testColumns"
              :data="bigTestObj.testExerciseTemplateList"
              ><template slot-scope="{ row, index }" slot="action">
                <div
                  style="max-height:100px;overflow:auto;"
                  v-html="row.exerciseContent"
                ></div> </template
            ></Table>
          </FormItem>
          <FormItem label="题库" label-position="top">
            <div style="height:32px;"></div>
            <Table
              height="400"
              size="small"
              :columns="channelColumns"
              :data="channelDatas"
              ><template slot-scope="{ row, index }" slot="action">
                <div
                  style="max-height:100px;overflow:auto;"
                  v-html="row.content"
                ></div> </template
            ></Table>
          </FormItem>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="showBigTest = false"
          >取消</Button
        >
        <Button type="primary" @click="handleSubmit('bigtestValidate')"
          >保存</Button
        >
      </div>
    </Drawer>

    <Modal v-model="showTemplateDelete" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除提示</span>
      </p>
      <div style="text-align:center">
        <p>确定删除所选实验报告模板吗？</p>
      </div>
      <div slot="footer">
        <Button
          type="error"
          size="large"
          long
          :loading="modal_loading"
          @click="delTemplateSubmit"
          >删除</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import API from "@/api";
import comselect from "@/components/ComSelect.vue";
import comupload from "@/components/ComUpload.vue";
import dateformat from "@/utils/dateformat.js";

export default {
  components: { comselect, comupload },
  data() {
    return {
      tempEditor: null,
      picBasePath: API.picPath,
      uploadAction: API.uploadPath + API.index.upload_upload,
      headers: null,
      uploadData: {
        file: null,
        name: "",
        type: "normal"
      },
      courseId: 0,
      courseInfo: null,
      modal_loading: false,
      pageData1: {
        total: 0,
        current: 1,
        pageSize: 10
      },
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
      channelColumns: [
        {
          title: "内容",
          slot: "action"
          // key: "exerciseContent",
          // render: (h, params) => {
          //   let result = params.row.exerciseContent;
          //   // this.tempEditor.txt.html(params.row.exerciseContent);
          //   // let result = this.tempEditor.txt.text();
          //   return h(
          //     "div",
          //     {
          //       class: "text-ellipsis4"
          //     },
          //     result
          //   );
          // }
        },
        {
          title: "题目类型",
          key: "exercisesType",
          width: 150,
          render: (h, params) => {
            let str = this.exercisesTypeDatasFormat[params.row.exercisesType];
            return h("span", str);
          }
        },
        {
          title: "正确答案",
          width: 150,
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
      testColumns: [
        {
          title: "内容",
          slot: "action"
          // key: "exerciseContent",
          // render: (h, params) => {
          //   let result = params.row.exerciseContent;
          //   // this.tempEditor.txt.html(params.row.exerciseContent);
          //   // let result = this.tempEditor.txt.text();
          //   return h(
          //     "div",
          //     {
          //       class: "text-ellipsis4"
          //     },
          //     result
          //   );
          // }
        },
        {
          title: "题目类型",
          key: "exercisesType",
          width: 150,
          render: (h, params) => {
            let str = this.exercisesTypeDatasFormat[params.row.exercisesType];
            return h("span", str);
          }
        },
        {
          title: "正确答案",
          width: 150,
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
      channelColumns2: [
        {
          title: "内容",
          slot: "action"
          // key: "exerciseContent",
          // render: (h, params) => {
          //   let result = params.row.exerciseContent;
          //   // this.tempEditor.txt.html(params.row.exerciseContent);
          //   // let result = this.tempEditor.txt.text();
          //   return h(
          //     "div",
          //     {
          //       class: "text-ellipsis4"
          //     },
          //     result
          //   );
          // }
        },
        {
          title: "题目类型",
          width: 150,
          key: "exercisesType",
          render: (h, params) => {
            let str = this.exercisesTypeDatasFormat[params.row.exercisesType];
            return h("span", str);
          }
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
                        this.templateObj.testExerciseTemplateList,
                        ["exerciseId", params.row.id]
                      );
                      console.log("testindex", testindex);
                      if (testindex === -1) {
                        this.templateObj.testExerciseTemplateList.push(
                          params.row
                        );
                      } else {
                        this.templateObj.testExerciseTemplateList[testindex] =
                          params.row;
                        this.$set(
                          this.templateObj.testExerciseTemplateList,
                          testindex,
                          params.row
                        );
                      }
                      console.log(
                        "this.templateObj.testExerciseTemplateList",
                        this.templateObj.testExerciseTemplateList
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
      testColumns2: [
        {
          title: "内容",
          slot: "action"
          // key: "exerciseContent",
          // render: (h, params) => {
          //   let result = params.row.exerciseContent;
          //   // this.tempEditor.txt.html(params.row.exerciseContent);
          //   // let result = this.tempEditor.txt.text();
          //   return h(
          //     "div",
          //     {
          //       class: "text-ellipsis4"
          //     },
          //     result
          //   );
          // }
        },
        {
          title: "题目类型",
          width: 150,
          key: "exercisesType",
          render: (h, params) => {
            let str = this.exercisesTypeDatasFormat[params.row.exercisesType];
            return h("span", str);
          }
        },
        {
          title: "序号",
          key: "serialNumber",
          width: 80,
          align: "center"
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
                      this.templateObj.testExerciseTemplateList.splice(
                        params.index,
                        1
                      );
                      console.log(
                        "this.templateObj.testExerciseTemplateList",
                        this.templateObj.testExerciseTemplateList
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
      templateColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "名称",
          key: "name"
        },
        {
          title: "试卷类型",
          width: 150,
          key: "testType",
          render: (h, params) => {
            let str = params.row.testType === 1 ? "实验报告" : "问卷调查";
            return h("span", str);
          }
        },
        {
          title: "总分",
          width: 150,
          key: "score"
        },
        {
          title: "说明",
          key: "description"
        }
        // {
        //   title: "操作",
        //   key: "action",
        //   width: 150,
        //   align: "center",
        //   render: (h, params) => {
        //     return h("div", [
        //       h(
        //         "Button",
        //         {
        //           props: {
        //             type: "primary",
        //             size: "small"
        //           },
        //           style: {
        //             marginRight: "5px"
        //           },
        //           on: {
        //             click: () => {
        //               this.getTemplateDetail(params.id);
        //               this.showTemplate = true;
        //               // this.showBigTest = true;
        //             }
        //           }
        //         },
        //         "配置测卷"
        //       )
        //     ]);
        //   }
        // }
      ],
      templateColumns2: [
        {
          title: "名称",
          key: "name"
        },
        {
          title: "试卷类型",
          width: 150,
          key: "testType",
          render: (h, params) => {
            let str = params.row.testType === 1 ? "实验报告" : "问卷调查";
            return h("span", str);
          }
        },
        {
          title: "说明",
          key: "description"
        }
      ],
      testTypeDatas: [
        {
          value: 1,
          label: "实验报告"
        },
        {
          value: 2,
          label: "问卷调查"
        }
      ],
      questionChannelDatas: [],
      channelDatas: [],
      templateselection: [],
      showTemplate: false,
      showTemplate2: false,
      showTemplateDelete: false,
      templateDatas: [],
      templateDatas2: [],
      templateObj: null,
      editTemplateObj: null,
      newTemplateObj: {
        courseId: 0,
        courseName: "",
        description: "",
        name: "",
        score: 0,
        testType: 1, //试卷类型 1-实验报告 2-问卷调查
        testExerciseTemplateList: [],
        testSubsectionTemplatePublicVoList: [
          {
            description: "实验操作",
            name: "实验操作",
            score: 0,
            serialNumber: 1,
            type: 1 //类型: 1-实验操作 2-实验数据 3-数据分析 4-实验报告
          },
          {
            description: "实验数据",
            name: "实验数据",
            score: 0,
            serialNumber: 2,
            type: 2
          },
          {
            description: "数据分析",
            name: "数据分析",
            score: 0,
            serialNumber: 3,
            type: 3
          },
          {
            description: "实验报告",
            name: "实验报告",
            score: 0,
            serialNumber: 4,
            type: 4,
            testPartTemplatePublicVoList: []
          }
        ]
      },
      // BigTest
      subsectionObj: null,
      showBigTest: false,
      bigTestIndex: -1,
      bigtestColumns: [
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
      bigTestObj: null,
      newBigTestObj: {
        description: "",
        name: "",
        score: 0,
        serialNumber: 1,
        testExerciseTemplateList: [],
        testSubsectionTemplateId: 0,
        testTemplateId: 0,
        type: 1
      },
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
    let courseId = this.$route.query.id;
    let _this = this;
    this.headers = {
      Authorization: "Bearer " + this.$store.getters.token
    };
    if (courseId) {
      this.courseId = courseId;
      this.getCourse();
      this.searchData();
      let tempEditor = new E("#tempEditorDiv");
      tempEditor.create();
      this.tempEditor = tempEditor;
    }
  },
  methods: {
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
    searchData() {
      this.getTemplateDatas();
    },
    getTemplateDatas() {
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
      this.axios.post(`${API.index.testTemplate_list}`, params).then(result => {
        if (result.code === 20000) {
          let templateDatas = [],
            templateDatas2 = [];
          this.templateDatas = result.result.list.forEach(t => {
            t.testType === 1 ? templateDatas.push(t) : templateDatas2.push(t);
          });
          this.templateDatas = templateDatas;
          this.templateDatas2 = templateDatas2;
        }
      });
    },
    addTemplate() {
      this.templateObj = { ...this.newTemplateObj };
      this.subsectionObj = this.templateObj.testSubsectionTemplatePublicVoList[3];
      this.showTemplate = true;
      console.log("this.templateObj", this.templateObj);
    },
    // 问卷调查
    addTemplate2() {
      this.templateObj = {
        ...this.newTemplateObj,
        testType: 2,
        score: 0,
        testSubsectionTemplatePublicVoList: []
      };
      this.showTemplate2 = true;
      this.getChannelDatas(null, 2);
      console.log("this.templateObj", this.templateObj);
    },
    tamplateSubmit() {
      let score = 0;
      if (this.templateObj.testType === 1) {
        // 实验报告
        this.templateObj.testSubsectionTemplatePublicVoList.forEach(t => {
          let intscore = parseInt(t.score);
          if (intscore) {
            score += intscore;
          }
        });
        if (score != this.templateObj.score) {
          this.$Message.error("四分项分数总和必须等于模板总分");
          return;
        }
      }
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
            this.$Message.success("保存成功");
            this.getTemplateDatas();
            this.templateObj = null;
            this.showTemplate = false;
            this.showTemplate2 = false;
          }
        })
        .catch(err => {
          this.$Message.error("保存失败");
        });
    },
    delTemplate() {
      if (this.templateselection.length < 1) {
        this.$Message.error("请先选择要删除的实验报告模板");
        return;
      }
      this.modal_loading = false;
      this.showTemplateDelete = true;
    },
    delTemplateSubmit() {
      let ids = [];
      ids = this.templateselection.map(s => s.id);
      this.modal_loading = true;

      this.axios({
        method: "delete",
        url: API.index.testTemplate,
        data: ids,
        showSpin: false
      })
        .then(result => {
          if (result.code === 20000) {
            this.showTemplateDelete = false;
            this.getTemplateDatas();
          }
          this.modal_loading = false;
        })
        .catch(err => {
          this.modal_loading = false;
          this.$Message.error("删除失败");
        });
    },
    templaterowSelect(selection, row) {
      this.templateselection = selection;
    },
    templaterowClick(item, index) {
      // this.templateObj = item;
      this.getTemplateDetail(item.id);
      this.showEdittemplate = true;
    },
    templaterowClick2(item, index) {
      // this.templateObj = item;
      this.getTemplateDetail(item.id, true);
      this.showEdittemplate = true;
    },
    getTemplateDetail(id, isquestion) {
      this.axios
        .get(`${API.index.testTemplate_detail}/${id}`, null)
        .then(result => {
          if (result.code === 20000) {
            this.templateObj = result.result;
            if (this.templateObj.testType === 1) {
              this.subsectionObj = this.templateObj.testSubsectionTemplatePublicVoList[3];
              this.showTemplate = true;
            } else {
              let testtype = isquestion ? 2 : 1;
              this.getChannelDatas(null, testtype);
              this.showTemplate2 = true;
            }
            console.log("this.templateObj", this.templateObj);
          }
        });
    },
    addBigTest() {
      // 计算递增序号
      let serialNumber = 1;
      if (this.subsectionObj.testPartTemplatePublicVoList) {
        serialNumber =
          this.subsectionObj.testPartTemplatePublicVoList.length + 1;
      } else {
        this.subsectionObj.testPartTemplatePublicVoList = [];
      }
      console.log("this.subsectionObj.score", this.subsectionObj.score);
      console.log(
        "this.subsectionObj.testPartTemplatePublicVoList",
        this.subsectionObj.testPartTemplatePublicVoList
      );
      // 计算剩余分数
      let leastscore =
        this.subsectionObj.score -
        _.sumBy(this.subsectionObj.testPartTemplatePublicVoList, tp => {
          return parseInt(tp.score);
        });
      if (leastscore < 1) {
        this.$Message.error(
          "实验报告分项的总分 " +
            this.subsectionObj.score +
            " 已经用完，无法继续添加大题"
        );
        return;
      }
      this.bigTestObj = {
        ...this.newBigTestObj,
        serialNumber: serialNumber,
        testSubsectionTemplateId: this.templateObj
          .testSubsectionTemplatePublicVoList[3].id,
        testTemplateId: this.templateObj.id,
        score: leastscore
      };
      this.bigTestIndex = -1;
      this.getChannelDatas(this.bigTestObj.type, 1);
      this.showBigTest = true;
    },
    bigtesttypeChange(name) {
      this.bigTestObj.testExerciseTemplateList = [];
      this.getChannelDatas(name, 1);
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
      if (this.bigTestObj.score != score) {
        this.$Message.error("所有小题的分数之和必须与大题分数相等");
        return;
      }
      // this.bigTestObj.score = score;
      // this.bigTestObj.testExerciseTemplateList = this.testselection;
      if (this.bigTestIndex === -1) {
        this.subsectionObj.testPartTemplatePublicVoList.push(this.bigTestObj);
        this.bigTestIndex =
          this.subsectionObj.testPartTemplatePublicVoList.length - 1;
      } else {
        this.subsectionObj.testPartTemplatePublicVoList[
          this.bigTestIndex
        ] = this.bigTestObj;
      }
      // console.log("this.testselection",this.testselection);
      // console.log("this.channelDatas",this.channelDatas);
      console.log(
        "this.subsectionObj.testPartTemplatePublicVoList",
        this.subsectionObj.testPartTemplatePublicVoList
      );

      this.$set(
        this.subsectionObj.testPartTemplatePublicVoList,
        this.bigTestIndex,
        this.bigTestObj
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
      this.subsectionObj.testPartTemplatePublicVoList.splice(index, 1);
    },
    bigtestrowClick(item, index) {
      this.bigTestObj = item;
      this.bigTestIndex = index;
      this.getChannelDatas(this.bigTestObj.type, 1);
      this.showBigTest = true;
    },
    getChannelDatas(type, testtype) {
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
      if (type) {
        params.searchParas.conditions.push({
          name: "exercisesType",
          op: "eq",
          type: "int",
          value: type
        });
      }
      if (testtype) {
        params.searchParas.conditions.push({
          name: "testType",
          op: "eq",
          type: "int",
          value: testtype
        });
      }
      this.axios.post(`${API.index.exercise_list}`, params).then(result => {
        if (result.code === 20000) {
          let channelDatas = result.result.list.map((c, index) => {
            return {
              ...c,
              exerciseId: c.id,
              exerciseContent: c.content,
              serialNumber: index + 1,
              score: 1
            };
          });
          if (testtype === 2) {
            this.questionChannelDatas = channelDatas;
            console.log("this.questionChannelDatas", this.questionChannelDatas);
          } else {
            this.channelDatas = channelDatas;
            console.log("this.channelDatas", this.channelDatas);
          }
        }
      });
    },
    getCourse() {
      this.axios
        .get(`${API.index.course_getDetail + "/"}` + this.courseId)
        .then(result => {
          if (result.code === 20000) {
            this.courseInfo = result.result;
            this.newTemplateObj.courseId = this.courseId;
            this.newTemplateObj.courseName = this.courseInfo.name;
            // this.newTemplateObj.score = this.courseInfo.reportScore;
            this.newTemplateObj.score = 100;
          }
        });
    }
  }
};
</script>
<style></style>

<style lang="less" scoped></style>
