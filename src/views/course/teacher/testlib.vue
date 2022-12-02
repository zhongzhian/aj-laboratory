<template>
  <div>
    <div class="table-condition-btnbar">
      <Button @click="addChannel" size="small" class="condition-btn"
        >添加</Button
      >
      <!-- <Button @click="editItem" size="small" class="condition-btn">编辑</Button> -->
      <Button @click="delChannel" size="small" class="condition-btn"
        >删除</Button
      >
      <Button @click="searchData" size="small" class="condition-btn"
        >刷新</Button
      >
    </div>
    <div>
      <!-- <f-table
        @on-select="rowSelect"
        @on-row-click="rowClick"
        :columns="columns1"
        :dataSource="data1"
      ></f-table> -->
      <!-- <b-table
        @page-data-change="currentChange"
        :pageData="pageData1"
        @on-select="rowSelect"
        @on-row-click="rowClick"
        :columns="columns1"
        :dataSource="data1"
      ></b-table> -->

      <Table
        size="small"
        :columns="columns2"
        :data="channelDatas"
        @on-row-click="channelrowClick"
        @on-select="channelrowSelect"
        @on-select-all="onSelectAll"
        @on-select-all-cancel="onSelectAllCancel"
      >
        <template slot-scope="{ row, index }" slot="action">
          <div
            style="max-height:100px;overflow:auto;"
            v-html="row.content"
          ></div>
        </template>
      </Table>
    </div>
    <!-- <div class="hyz-page">
      <Page :total="total" :current="page" :page-size="pageSize" :page-size-opts="sizeOpts" show-sizer show-elevator
        show-total size="small" placement="top" @on-change="changePage" @on-page-size-change="pageSizeChange" />
    </div> -->

    <Drawer
      title="习题"
      v-model="showEditChannel"
      width="650"
      :mask-closable="false"
      class-name="demo-drawer-style"
    >
      <div class="demo-drawer-content">
        <Form ref="channelValidate" :model="channelObj" :rules="ruleValidate">
          <FormItem
            v-if="
              channelObj.exercisesType === 5 || channelObj.exercisesType === 6
            "
            label="内容"
            prop="content"
            label-position="top"
          >
            <richinput ref="testlib_richinput"></richinput>
            <!-- <RadioGroup v-model="optionType" @on-change="optionTypeChange">
              <Radio :disabled="channelObj.id" label="文字"></Radio>
              <Radio :disabled="channelObj.id" label="图片"></Radio>
            </RadioGroup>
            <template v-if="optionType === '文字'">
              <richinput ref="testlib_richinput"></richinput>
            </template>
            <template v-if="optionType === '图片'">
              <div>
                支持jpg、jpeg、png格式，文件大小不超过2M，尺寸建议不小于300*150
              </div>
              <Upload
                ref="upload"
                :action="uploadAction"
                :headers="headers"
                :data="uploadData"
                :show-upload-list="false"
                :on-success="handleSuccessX"
                :format="['jpg', 'jpeg', 'png']"
                :max-size="2048"
                :on-format-error="handleFormatErrorABCD"
                :on-exceeded-size="handleMaxSizeABCD"
                :before-upload="handleBeforeUpload"
              >
                <img
                  v-if="channelObj.content"
                  :src="channelObj.content"
                  class="test-content-img"
                />
                <img
                  v-if="!channelObj.content"
                  src="http://temp.im/300x150"
                  class="test-content-img"
                />
              </Upload>
            </template> -->
          </FormItem>
          <FormItem
            v-else-if="
              channelObj.exercisesType === 1 ||
                channelObj.exercisesType === 2 ||
                channelObj.exercisesType === 3 ||
                channelObj.exercisesType === 4
            "
            label="内容"
            prop="content"
            label-position="top"
          >
            <!-- <Input
              type="textarea"
              v-model="channelObj.content"
              :rows="4"
              placeholder="请输入内容"
            /> -->
            <!-- <div id="testlibeditorid" style="margin-top: 35px;"></div> -->
            <richinput ref="testlib_richinput"></richinput>
          </FormItem>
          <FormItem label="试卷类型" prop="testType">
            <Select
              @on-change="testTypeChange"
              :disabled="channelObj.id"
              v-model="channelObj.testType"
              placeholder="请选择试卷类型"
            >
              <Option
                v-for="item in testTypeDatas"
                :value="item.value"
                :key="item"
                >{{ item.label }}</Option
              >
            </Select>
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
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          <FormItem
            v-if="
              channelObj.exercisesType === 1 || channelObj.exercisesType === 2
            "
            label="选项"
            prop="options"
          >
            <RadioGroup v-model="optionType">
              <Radio :disabled="channelObj.id" label="文字"></Radio>
              <Radio :disabled="channelObj.id" label="图片"></Radio>
            </RadioGroup>
            <template v-if="optionType === '文字'">
              <div
                v-for="option in optionArr"
                :value="option"
                :key="option.order"
              >
                {{ option.order }}:
                <Input
                  v-model="option.content"
                  size="small"
                  :placeholder="请输入选项值"
                />
              </div>
              <!-- <div>
                B:
                <Input
                  v-model="optionArr[1].B"
                  size="small"
                  placeholder="请输入B选项"
                />
              </div> -->
            </template>
            <template v-if="optionType === '图片'">
              <!-- <div>
                A:
                <Upload
                  ref="upload"
                  :action="uploadAction"
                  :headers="headers"
                  :data="uploadData"
                  :show-upload-list="false"
                  :on-success="handleSuccessA"
                  :format="['jpg', 'jpeg', 'png']"
                  :max-size="1024"
                  :on-format-error="handleFormatErrorABCD"
                  :on-exceeded-size="handleMaxSizeABCD"
                  :before-upload="handleBeforeUpload"
                >
                  <img
                    v-if="optionArr[0].A"
                    :src="optionArr[0].A"
                    class="form-user-img"
                  />
                  <img
                    v-if="!optionArr[0].A"
                    src="static/images/noperson.png"
                    class="form-user-img"
                  />
                </Upload>
              </div> -->
              <div
                v-for="option in optionArr"
                :value="option.content"
                :key="option.order"
              >
                <comupload
                  :comdata="option"
                  @comuplaodsuccess="handleSuccessABCD"
                ></comupload>
              </div>
            </template>
            <!-- <Input v-model="channelObj.options" size="small" placeholder="请输入选项" /> -->
          </FormItem>
          <template v-if="channelObj.testType === 1">
            <!-- 题目类型 1-单选题 2-多选题 3-填空题 4-判断题 5-问答题 6-计算题 , -->
            <FormItem
              v-if="channelObj.exercisesType === 1"
              label="正确答案"
              prop="answer"
            >
              <RadioGroup v-model="channelObj.answer">
                <Radio
                  v-for="option in optionArr"
                  :value="option.content"
                  :key="option.order"
                  :label="option.order"
                ></Radio>
                <!-- <Radio label="A"></Radio>
                <Radio label="B"></Radio>
                <Radio label="C"></Radio>
                <Radio label="D"></Radio> -->
              </RadioGroup>
            </FormItem>
            <FormItem
              v-else-if="channelObj.exercisesType === 2"
              label="正确答案"
              prop="mulAnswer"
            >
              <CheckboxGroup
                v-if="channelObj.exercisesType === 2"
                v-model="channelObj.mulAnswer"
              >
                <Checkbox
                  v-for="option in optionArr"
                  :value="option.content"
                  :key="option.order"
                  :label="option.order"
                ></Checkbox>
              </CheckboxGroup>
            </FormItem>
            <FormItem
              v-else-if="channelObj.exercisesType === 4"
              label="正确答案"
              prop="answer"
            >
              <RadioGroup v-model="channelObj.answer">
                <Radio label="正确"></Radio>
                <Radio label="错误"></Radio>
              </RadioGroup>
            </FormItem>
            <FormItem
              v-else-if="channelObj.exercisesType === 3"
              label="正确答案"
              prop="answer"
            >
              <Input
                v-model="channelObj.answer"
                size="small"
                placeholder="请输入正确答案"
              />
            </FormItem>
            <!-- 问答题和计算题这种主观题，不应设置标准答案, by 老师 20210406 -->
            <!-- <FormItem v-else label="正确答案" prop="answer">
              <template v-if="optionType === '文字'">
                <Input
                  type="textarea"
                  v-model="channelObj.answer"
                  :rows="4"
                  placeholder="请输入正确答案"
                />
              </template>
              <template v-if="optionType === '图片'">
                <div>
                  支持jpg、jpeg、png格式，文件大小不超过2M，尺寸建议至少300*150
                </div>
                <Upload
                  ref="upload"
                  :action="uploadAction"
                  :headers="headers"
                  :data="uploadData"
                  :show-upload-list="false"
                  :on-success="handleSuccessXA"
                  :format="['jpg', 'jpeg', 'png']"
                  :max-size="2048"
                  :on-format-error="handleFormatErrorABCD"
                  :on-exceeded-size="handleMaxSizeABCD"
                  :before-upload="handleBeforeUpload"
                >
                  <img
                    v-if="channelObj.answer"
                    :src="channelObj.answer"
                    class="test-content-img"
                  />
                  <img
                    v-if="!channelObj.answer"
                    src="http://temp.im/300x150"
                    class="test-content-img"
                  />
                </Upload>
              </template>
            </FormItem> -->
          </template>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="showEditChannel = false"
          >取消</Button
        >
        <Button type="primary" @click="handleSubmit('channelValidate')"
          >保存</Button
        >
      </div>
    </Drawer>
    <Modal v-model="showChannelDelete" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除提示</span>
      </p>
      <div style="text-align:center">
        <p>确定删除所选习题吗？</p>
      </div>
      <div slot="footer">
        <Button
          type="error"
          size="large"
          long
          :loading="modal_loading"
          @click="delChannelSubmit"
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
import richinput from "../component/richInput";

export default {
  components: { comselect, comupload, richinput },
  data() {
    return {
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
      columns2: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "内容",
          slot: "action"
          // key: "content",
          // render: (h, params) => {
          //   return h(
          //     "div",
          //     {
          //       class: "text-ellipsis4"
          //     },
          //     params.row.content
          //   );
          // },
          // render(h, params) {
          //   return <div>{params.row.content}</div>;
          // }
        },
        {
          title: "试卷类型",
          key: "testType",
          width: 150,
          render: (h, params) => {
            let str = params.row.testType === 1 ? "实验报告" : "问卷调查";
            return h("span", str);
          }
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
          key: "answer",
          width: 150,
          render: (h, params) => {
            let str = params.row.answer || "-";
            return h("span", str);
          }
        }
      ],
      channelDatas: [],
      channelObj: {
        answer: "",
        testType: 1, //试卷类型 1-实验报告 2-问卷调查
        content: "",
        courseId: 0,
        courseName: "",
        exercisesType: 1,
        options: ""
      },
      ruleValidate: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],

        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
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
      },
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
      optionType: "文字",
      optionArr: [
        { order: "A", content: "" },
        { order: "B", content: "" },
        { order: "C", content: "" },
        { order: "D", content: "" }
      ],
      mulAnswer: [],
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
      showChannelDelete: false,
      showEditChannel: false,
      channelselection: [],
      testlibeditor: null
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
    }
  },
  methods: {
    testTypeChange(value) {
      console.log("testTypeChange", this.channelObj);
      if (value === 2) {
        this.exercisesTypeDatas = [
          {
            value: 1,
            label: "单选题"
          },
          {
            value: 2,
            label: "多选题"
          },
          {
            value: 5,
            label: "问答题"
          }
        ];
      } else {
        this.exercisesTypeDatas = [
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
        ];
      }
      this.channelObj.exercisesType = 1;
    },
    handleSubmit(name) {
      let _this = this;
      this.channelObj.content = this.$refs["testlib_richinput"].getTxt();
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
    addChannel() {
      this.channelObj = {
        answer: "",
        content: "",
        courseId: this.courseInfo.id,
        courseName: this.courseInfo.name,
        displayType: 1,
        testType: 1,
        exercisesType: 1,
        options: [
          { order: "A", content: "" },
          { order: "B", content: "" },
          { order: "C", content: "" },
          { order: "D", content: "" }
        ],
        mulAnswer: []
      };
      this.optionType = "文字";
      this.optionArr = this.channelObj.options.concat([]);
      this.mulAnswer = [];

      this.$refs["testlib_richinput"].setTxt(this.channelObj.content);
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
          this.optionArr[0].content &&
          this.optionArr[1].content &&
          this.optionArr[2].content &&
          this.optionArr[3].content
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
        let optionobj = [
          { order: "A", content: "1" },
          { order: "B", content: "2" },
          { order: "C", content: "3" },
          { order: "D", content: "4" }
        ];
        this.channelObj.options = JSON.stringify(optionobj);
      }
      if (this.channelObj.exercisesType === 4) {
        this.channelObj.answer = this.channelObj.answer === "正确" ? "A" : "B";
      }
      this.channelObj.displayType = this.optionType === "文字" ? 1 : 2;
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
        this.$Message.error("请先选择要删除的题目");
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
    searchData() {
      this.getChannelDatas();
    },
    getChannelDatas(type) {
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
    handleBeforeUpload(file) {
      this.uploadData.file = file;
      this.uploadData.name = file.name;
    },
    handleSuccessABCD(res, file, fileList, option) {
      console.log("handleSuccessABCD.res", res);
      console.log("handleSuccessABCD.file", file);
      console.log("handleSuccessABCD.fileList", fileList);
      console.log("handleSuccessABCD.option", option);
      if (res.code === 20000) {
        let splits = res.result.uploadFileName.split("|");
        let path = splits[1] ? splits[1] : splits[0];
        file.url = this.picBasePath + path;
        let order = option.order;
        let optionObj = this.optionArr.find(o => {
          return o.order === order;
        });
        if (optionObj) {
          optionObj.content = file.url;
        }
      } else if (res.code === 50401) {
        console.log("this.$route.name....", this.$route.name);
        this.$router.push({
          name: "login",
          query: {
            name: this.$route.name
          }
        });
      } else {
        this.$Message.error(res.message);
      }
    },

    handleSuccessA(res, file, fileList) {
      if (res.code === 20000) {
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
      } else {
        this.$Message.error(res.message);
      }
    },
    handleSuccessB(res, file, fileList) {
      if (res.code === 20000) {
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
      } else {
        this.$Message.error(res.message);
      }
    },
    handleSuccessC(res, file, fileList) {
      if (res.code === 20000) {
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
      } else {
        this.$Message.error(res.message);
      }
    },
    handleSuccessD(res, file, fileList) {
      if (res.code === 20000) {
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
      } else {
        this.$Message.error(res.message);
      }
    },
    handleMaxSizeABCD(file) {
      this.$Notice.warning({
        title: "文件过大",
        desc: "上传的答案图片不能大于1M."
      });
    },
    handleFormatErrorABCD(file) {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件 " + file.name + " 格式错误, 目前仅支持jpg,jpeg,png格式."
      });
    },
    channelrowSelect(selection, row) {
      this.channelselection = selection;
      console.log(
        "channelrowSelect this.channelselection",
        this.channelselection
      );
    },
    onSelectAll(selection, row) {
      this.channelselection = selection;
      console.log("onSelectAll this.channelselection", this.channelselection);
    },
    onSelectAllCancel(selection, row) {
      this.channelselection = selection;
      console.log("onSelectAll this.channelselection", this.channelselection);
    },
    channelrowClick(item, index) {
      this.channelObj = item;
      this.optionArr = JSON.parse(this.channelObj.options);
      this.optionType = this.channelObj.displayType === 1 ? "文字" : "图片";
      //  this.optionType =  this.optionArr[0].A.indexOf("http://") === 0 ? "图片" : "文字";
      if (this.channelObj.exercisesType === 2) {
        this.channelObj.mulAnswer = this.channelObj.answer.split(",");
      }
      if (this.channelObj.exercisesType === 4) {
        this.channelObj.answer =
          this.channelObj.answer === "A" ? "正确" : "错误";
      }
      this.$refs["testlib_richinput"].setTxt(this.channelObj.content);
      // if (
      //   this.channelObj.exercisesType === 3 ||
      //   this.channelObj.exercisesType === 5 ||
      //   this.channelObj.exercisesType === 6
      // ) {
      //   this.optionType =
      //     this.channelObj.content.indexOf("http://") === 0 ? "图片" : "文字";
      // }
      this.showEditChannel = true;
    },
    getCourse() {
      this.axios
        .get(`${API.index.course + "/"}` + this.courseId)
        .then(result => {
          if (result.code === 20000) {
            this.courseInfo = result.result;
            this.getChannelDatas();
            // this.chapterDatas = result.result.chapterList;
            // this.newChapter.courseId = result.result.id;
            // this.newChapter.courseName = result.result.name;
            // this.newSection.courseId = result.result.id;
            // this.newSection.courseName = result.result.name;
          }
        });
    },
    initEditor(id) {
      let editor = new E(id);
      // editor.customConfig.uploadImgShowBase64 = true; // 使用 base64 保存图片
      editor.customConfig.uploadImgServer = this.uploadAction; // 将图片上传到服务器上
      // 限制一次最多上传 5 张图片
      editor.customConfig.uploadImgMaxLength = 1;
      editor.customConfig.uploadImgHeaders = {
        Authorization: "Bearer " + this.$store.getters.token
      };

      editor.customConfig.uploadFileName = "file";
      editor.customConfig.uploadImgParams = {
        name: "aaa.jpg",
        type: "normal"
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
      this.testlibeditor = editor;
    }
  }
};
</script>
<style></style>

<style lang="less" scoped></style>
