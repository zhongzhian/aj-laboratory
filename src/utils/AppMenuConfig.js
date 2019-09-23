const AppMenuConfig = {
    menu_level_one: [
        { name: '首页', link: 'home', icon: 'home', id: '1', show: '1' },
        { name: '拓扑', link: 'topo', icon: 'global', id: '2', show: '1'},
        { name: '告警', link: 'alarm', icon: 'warning', id: '3', show: '1',item:[
            { name: '活动告警', link: 'activeAlarm', icon: '', id: '3-1', show: '1' },
            { name: '历史告警', link: 'historyAlarm', icon: '', id: '3-2', show: '1' },
        ] },
        { name: '专线监控管理', link: 'slmm', icon: 'desktop', id: '4', show: '1',item:
            [
                { name: '专线管理', link: 'sllist', icon: '', id: '5', show: '1' },
                { name: 'QOS服务质量监控', link: 'qosmonitor', icon: '', id: '6', show: '1' },
                { name: 'SLA服务质量监控', link: 'slamonitor', icon: '', id: '7', show: '1' },
                { name: 'SLA采集管理', link: 'slcollector', icon: '', id: '8', show: '1' },
            ]
        },
        { name: '自服务', link: 'alarm', icon: 'warning', id: '9', show: '1' },
        { name: '性能管理', link: 'pm', icon: 'desktop', id: '10', show: '1',item:
        [
            { name: '联通设备性能管理', link: 'unicomPm', icon: '', id: '11', show: '1' },
            { name: '内网设备性能管理', link: 'innerPm', icon: '', id: '12', show: '1' },
        ]
    },
        { name: '报表', link: 'report', icon: 'add', id: '13', show: '1' },
        { name: '系统维护', link: 'setting', icon: 'setting', id: '14', show: '1' },
    ],
   
};
export default AppMenuConfig;
