import { REST_API, WS_BASE } from "../config";
// const UPLOADPATH = 'http://47.93.116.221:8000';
const UPLOADPATH = REST_API;
const WS_PATH = WS_BASE;
export default {
  wsPath: WS_PATH,
  uploadPath: UPLOADPATH,
  picPath: UPLOADPATH + "/remoteLaboratory/upload/",
  login: {
    register: `/remoteLaboratory/user/register`,
    token: `/remoteLaboratory/user/login`,
    modifyPassword: `/remoteLaboratory/user/modifyPassword`,
    logout: `/remoteLaboratory/user/loginout`,
    account: `/remoteLaboratory/user/current`
  },
  index: {
    user_list: `/remoteLaboratory/user/list`,
    teacher_list: `/remoteLaboratory/user/teacherList`,
    user: `/remoteLaboratory/user`,
    user_forumForbidden: `/remoteLaboratory/user/forumForbidden/`,
    user_modify: `/remoteLaboratory/user/modifyUserInfo`,
    device_list: `/remoteLaboratory/device/list`,
    device: `/remoteLaboratory/device`,
    signalChannel_list: `/remoteLaboratory/signalChannel/list`,
    signalChannel: `/remoteLaboratory/signalChannel`,
    camera_list: `/remoteLaboratory/camera/list`,
    camera: `/remoteLaboratory/camera`,
    srsServer_list: `/remoteLaboratory/srsServer/list`,
    srsServer: `/remoteLaboratory/srsServer`,
    sysSetting_list: `/remoteLaboratory/sysSetting/list`,
    sysSetting: `/remoteLaboratory/sysSetting`,
    getHomePageImages: `/remoteLaboratory/sysSetting/getHomePageImages`,
    getHomePageBottomImages: `/remoteLaboratory/sysSetting/getHomePageBottomImages`,

    upload_upload: `/remoteLaboratory/uploadFile/upload`,
    upload_list: `/remoteLaboratory/uploadFile/list`,
    upload_mylist: `/remoteLaboratory/uploadFile/myList`,
    upload_deleteById: `/remoteLaboratory/uploadFile/deleteById/`,

    course_list: `/remoteLaboratory/course/list`,
    course: `/remoteLaboratory/course`,
    course_getDetail: `/remoteLaboratory/course/getDetail`,
    course_getmy: `/remoteLaboratory/courseStudyRecord/getMy`,
    course_detail_getmy: `/remoteLaboratory/courseStudyRecord/getMyDetailByCourseId/`,
    updateStatus: `/remoteLaboratory/course/updateStatus/`,
    chapter_list: `/remoteLaboratory/chapter/list`,
    chapter: `/remoteLaboratory/chapter`,
    section_list: `/remoteLaboratory/section/list`,
    section: `/remoteLaboratory/section`,
    section_start: `/remoteLaboratory/section/startStudy/`,
    section_finish: `/remoteLaboratory/section/finish/`,
    exercise_list: `/remoteLaboratory/exercise/list`,
    exercise: `/remoteLaboratory/exercise`,
    testTemplate_bySid: `/remoteLaboratory/testTemplate/getDetailBySectionId/`,
    testTemplate: `/remoteLaboratory/testTemplate`,
    courseDevice_list: `/remoteLaboratory/courseDevice/list`,
    courseDevice: `/remoteLaboratory/courseDevice`,
    courseDevice_listadd: `/remoteLaboratory/courseDevice/listAdd`,
    courseDevice: `/remoteLaboratory/courseDevice`,
    announcement_list: `/remoteLaboratory/announcement/list`,
    announcement: `/remoteLaboratory/announcement`,
    subject_list: `/remoteLaboratory/subject/list`,
    subject: `/remoteLaboratory/subject`,
    simulation_list: `/remoteLaboratory/simulation/list`,
    simulation: `/remoteLaboratory/simulation`,
    reply_list: `/remoteLaboratory/reply/list`,
    reply: `/remoteLaboratory/reply`,

    deviceOrder_list: `/remoteLaboratory/deviceOrder/list`,
    deviceOrder: `/remoteLaboratory/deviceOrder/order/`,
    deviceOrder_getmy: `/remoteLaboratory/deviceOrder/getMy`,
    deviceOrder_getDetail: `/remoteLaboratory/deviceOrder/getOrderDeviceDetail/`,

    test_submit: `/remoteLaboratory/testInstance/submit/`,
    test_finish: `/remoteLaboratory/testInstance/finish/`,
    test_getMy: `/remoteLaboratory/testInstance/getMy`,
    test_answer: `/remoteLaboratory/testInstance/answer`,
    test_grade: `/remoteLaboratory/testInstance/grade`,
    getMyBySectionId: `/remoteLaboratory/testInstance/getMyBySectionId/`,
    startTestBySectionId: `/remoteLaboratory/testInstance/startTestBySectionId/`,
    test_listByCourseId: `/remoteLaboratory/testInstance/listByCourseId/`,
    test_listByChapterId: `/remoteLaboratory/testInstance/listByChapterId/`,
    test_listBySectionId: `/remoteLaboratory/testInstance/listBySectionId/`,
    test_getDetail: `/remoteLaboratory/testInstance/getDetail/`,

    startStudy: `/remoteLaboratory/courseStudyRecord/startStudy/`,
    study_getMy: `/remoteLaboratory/courseStudyRecord/getMy`
  }
};
