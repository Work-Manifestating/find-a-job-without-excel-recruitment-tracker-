const JOB_TYPE_OPTIONS = ["PART_TIME", "FULL_TIME", "INTERNSHIP"];
const COMPANY_CATEGORY_OPTIONS = [
  "", "IB_FRONT_OFFICE", "IB_MIDDLE_BACK_OFFICE", "INSURANCE", "PEVC",
  "STARTUP", "BIG_FOUR", "CONSULTING", "CORPORATE", "TECH", "OTHER",
];
const COMMUTE_REQUIREMENT_OPTIONS = ["", "ONSITE", "HYBRID", "REMOTE", "FLEXIBLE", "RELOCATION", "OTHER"];
const VISA_SPONSORSHIP_OPTIONS = ["", "YES", "NO", "UNCLEAR", "CASE_BY_CASE"];
const ROTATION_PREFERENCE_OPTIONS = ["", "NONE", "OPTIONAL", "REQUIRED", "RANKED_CHOICES", "UNKNOWN"];
const APPLICATION_LIMIT_OPTIONS = ["", "NO_LIMIT", "ONE_ROLE", "LIMITED_ROLES", "ONE_PROGRAM", "UNKNOWN"];
const DUPLICATE_CHECK_OPTIONS = ["", "YES", "NO", "UNCLEAR"];
const INTERVIEW_PROCESS_OPTIONS = [
  "", "UNKNOWN", "HR_PHONE", "OA_VI", "ONE_ROUND", "TWO_ROUNDS",
  "THREE_ROUNDS", "ASSESSMENT_CENTER", "CASE_INTERVIEW", "FINAL_ONLY",
];
const STAGE_OPTIONS = ["SAVED", "APPLIED", "ASSESSMENT", "INTERVIEW", "ARCHIVED"];
const NEXT_ACTION_OPTIONS = ["DECIDE", "APPLY", "WAIT", "FOLLOW_UP", "PREPARE", "COMPLETE_TASK", "ARCHIVE"];
const MODULE_VIEWS = {
  WEEKLY_REVIEW: {
    title: "每周复盘",
    summary: "每周复盘投递进展、停滞岗位和下周行动。",
    status: "Planned",
    metrics: ["本周新增投递", "本周状态变化", "超过 7 天未更新", "下周重点"],
    cards: [
      ["本周活动汇总", "汇总本周新增岗位、OA、面试、拒绝和手动 Timeline。"],
      ["停滞岗位", "找出长时间没有更新的岗位，提醒是否 follow up 或归档。"],
      ["下周行动清单", "把需要准备、跟进、复盘的事项整理成一页。"],
    ],
  },
  QUESTION_BANK: {
    title: "申请题答案库",
    summary: "保存申请表常见问题和可复用答案版本。",
    status: "New feature",
    metrics: ["问题分类", "答案模板", "岗位标签", "复制使用"],
    cards: [
      ["常见申请题", "例如 sponsorship、salary expectation、notice period、why this company。"],
      ["答案多版本", "同一个问题可保存正式版、简短版、技术岗版、校招版。"],
      ["未来自动填表接口", "后续可和插件连接，但模块本身先作为答案知识库独立存在。"],
    ],
  },
  INTERVIEW_STORIES: {
    title: "面试故事库",
    summary: "用 STAR 结构管理可复用的面试故事。",
    status: "New feature",
    metrics: ["STAR 故事", "能力标签", "岗位关联", "面试复盘"],
    cards: [
      ["故事素材", "沉淀 leadership、teamwork、conflict、ownership 等故事素材。"],
      ["按标签检索", "面试前按能力标签快速筛选能讲的案例。"],
      ["面试复盘备注", "记录每次面试后哪些故事有效、哪些需要重写。"],
    ],
  },
  COMPANY_NOTES: {
    title: "公司研究笔记",
    summary: "以公司为中心管理研究笔记和关联岗位。",
    status: "New feature",
    metrics: ["公司档案", "关联岗位", "为什么感兴趣", "面试重点"],
    cards: [
      ["公司档案", "记录业务、产品、文化、新闻、风险点和个人兴趣点。"],
      ["关联岗位", "同一家公司多个岗位共用研究资料，减少重复准备。"],
      ["面试重点", "把面试前需要复习的公司信息集中到一个地方。"],
    ],
  },
  EMAIL_SYNC: {
    title: "Email Sync",
    summary: "同步招聘邮件并写入岗位 Timeline。",
    status: "Planned",
    metrics: ["Gmail", "Outlook", "邮件分类", "人工确认"],
    cards: [
      ["邮件导入", "从邮箱拉取确认、OA、面试、拒信等求职邮件。"],
      ["岗位匹配", "先做半自动匹配，避免同公司多岗位造成误判。"],
      ["Timeline 更新", "确认后写入 Timeline，并更新当前阶段或子状态。"],
    ],
  },
  AI_ASSISTANT: {
    title: "AI Assistant",
    summary: "围绕 JD、邮件、状态和准备材料提供自动化建议。",
    status: "Planned",
    metrics: ["JD 摘要", "邮件识别", "匹配评分", "行动建议"],
    cards: [
      ["JD 解析", "提炼岗位要求、关键词、缺口和准备重点。"],
      ["邮件识别", "识别 OA、面试、拒信、follow-up 等邮件类型。"],
      ["流程建议", "根据当前状态给出下一步操作建议。"],
    ],
  },
  COVER_LETTERS: {
    title: "Cover Letters",
    summary: "按岗位和公司生成、保存、管理求职信草稿。",
    status: "Planned",
    metrics: ["草稿", "版本", "岗位关联", "导出"],
    cards: [
      ["草稿工作区", "把 JD、公司笔记和简历 Profile 组合成一版初稿。"],
      ["版本历史", "保留不同语气和不同岗位重点的版本。"],
      ["可复用段落", "沉淀可复用段落，减少重复写作。"],
    ],
  },
  AUTO_APPLY: {
    title: "Auto Apply",
    summary: "长期自动化投递能力的控制台。",
    status: "Long-term",
    metrics: ["表单填入", "材料选择", "投递确认", "人工审核"],
    cards: [
      ["人工确认投递", "自动填表和材料选择需要人工确认后提交。"],
      ["平台规则集", "针对不同招聘系统维护独立规则。"],
      ["操作日志", "每次自动化操作都记录到 Timeline，方便追踪。"],
    ],
  },
};
const MODULE_TITLE_KEYS = {
  WEEKLY_REVIEW: "weeklyReview",
  QUESTION_BANK: "questionBank",
  INTERVIEW_STORIES: "interviewStories",
  COMPANY_NOTES: "companyNotes",
  EMAIL_SYNC: "emailSync",
  AI_ASSISTANT: "aiAssistant",
  COVER_LETTERS: "coverLetters",
  AUTO_APPLY: "autoApply",
};

const SUBSTATUS_BY_STAGE = {
  SAVED: ["SAVED", "SAVED_TO_APPLIED", "SAVED_NOT_APPLY"],
  APPLIED: ["APPLIED_SUCCESS", "APPLIED_STALE", "APPLIED_REJECTED"],
  ASSESSMENT: [
    "ASSESSMENT_INVITED",
    "ASSESSMENT_COMPLETED",
    "ASSESSMENT_NEXT_ROUND",
    "ASSESSMENT_REJECTED",
  ],
  INTERVIEW: [
    "INTERVIEW_INVITED",
    "INTERVIEW_COMPLETED",
    "INTERVIEW_NEXT_ROUND",
    "INTERVIEW_FINAL",
    "INTERVIEW_REJECTED",
    "OFFER",
  ],
  ARCHIVED: ["ARCHIVED"],
};
const CUSTOM_STATUS_VALUE = "__CUSTOM__";
const DEADLINE_MANUAL_VALUE = "__MANUAL_DEADLINE__";
const DEADLINE_ROLLING_VALUE = "roling base";

const I18N = {
  zh: {
    navTrack: "追踪",
    navReview: "复盘",
    navPrepare: "准备",
    navAutomation: "自动化",
    navFilters: "筛选",
    allFilter: "全部",
    resetFilters: "重置筛选",
    prepareSummary: "把申请题、面试故事、公司笔记和简历档案集中在这里准备。",
    dashboard: "主控台",
    dashboardSummary: "先看总览，再进入左侧详细页面处理具体任务。",
    dashboardActive: "仍在流程",
    dashboardRejected: "已被拒",
    dashboardAssessments: "进入笔试",
    dashboardInterviews: "进入面试",
    actionNeeded: "需要行动",
    noActionNeeded: "目前没有需要立即处理的岗位。",
    recentApplications: "最近岗位",
    noRecentApplications: "暂无最近岗位",
    latestWeeklyNote: "最近复盘",
    noWeeklyNote: "还没有保存复盘，先写一条本周总结。",
    reviewCalendar: "复盘日历",
    previousMonth: "上个月",
    nextMonth: "下个月",
    calendarSelectedDate: "选中日期",
    dailyReviewPlaceholder: "写下这一天的投递复盘、面试体感、需要跟进的事。",
    dailyReviewSaved: "已保存到主控台",
    saveDailyReview: "保存当天复盘",
    noDailyReview: "这一天还没有复盘。",
    dayActivity: "当日记录",
    jobsRecorded: "当天新增 / 收藏",
    jobsApplied: "当天投递",
    timelineActivity: "当天进展",
    weeklyReflection: "本周复盘",
    dailyReflection: "当天复盘",
    noDayActivity: "这一天还没有岗位或时间线记录。",
    quickActions: "下一步",
    goApplications: "查看岗位明细",
    goWeekly: "打开每周复盘",
    goQuestions: "整理申请题答案",
    goStories: "整理面试故事",
    goCompanies: "整理公司笔记",
    applications: "岗位追踪",
    prepare: "准备材料",
    summarize: "漏斗分析",
    summaryIntroTitle: "这页看什么",
    summaryIntroBody: "这里不是写复盘的地方，而是看投递漏斗：已投递岗位里有多少进入笔试、面试、被拒，以及哪些子状态占比最高。收藏岗位不会计入漏斗。",
    weeklyReview: "每周复盘",
    questionBank: "申请题答案库",
    interviewStories: "面试故事库",
    companyNotes: "公司研究笔记",
    resumeProfiles: "简历档案",
    emailSync: "邮件同步",
    aiAssistant: "AI 助手",
    coverLetters: "求职信",
    autoApply: "自动投递",
    loading: "加载中...",
    newJob: "+ 新增岗位",
    newProfile: "+ 新增档案",
    languageToggle: "EN",
    searchPlaceholder: "搜索公司、岗位、链接",
    refresh: "刷新",
    tableApplyTime: "记录时间",
    tablePosition: "岗位名字",
    tableCompanyCategory: "公司类型",
    tableType: "分类",
    tableStage: "阶段",
    tableStatus: "子状态",
    tableTimeline: "时间线",
    tableNextAction: "下一步",
    tableDeadline: "Deadline",
    deadlineEmpty: "选择 Deadline",
    deadlineManual: "手动输入日/月/年",
    deadlineRolling: "roling base",
    deadlineDatePrompt: "请输入 deadline（日/月/年）",
    tableUpdated: "更新",
    tableActions: "操作",
    emptyJobs: "还没有岗位，先新增一条。",
    jobsCount: "{count} 个岗位",
    timelineCount: "{count} 条",
    edit: "编辑",
    delete: "删除",
    cancel: "取消",
    save: "保存",
    saveChanges: "保存修改",
    uploadSave: "上传保存",
    exit: "退出",
    close: "关闭",
    addJobTitle: "新增岗位",
    editJobTitle: "编辑岗位",
    openJdTitle: "打开 JD",
    company: "公司",
    position: "岗位",
    companyCategory: "公司类型",
    department: "部门",
    officeLocation: "办公地区",
    commuteRequirement: "通勤要求",
    sourceUrl: "JD 页面 URL",
    applyUrl: "投递入口 URL",
    applyTime: "投递时间",
    visaSponsorship: "是否给签证",
    salaryRange: "薪资范围",
    rotationPreference: "Rotation 志愿",
    applicationLimit: "投递数量限制",
    duplicateCheck: "是否查并号",
    interviewProcess: "面试流程",
    requirements: "Requirement",
    nextAction: "下一步",
    jobType: "分类",
    stage: "阶段",
    subStatus: "子状态",
    customSubStatus: "自定义子状态",
    customStatusPlaceholder: "例如：等 HR 回复",
    jdContent: "JD 内容",
    jdPlaceholder: "先粘贴 JD 文本，后续会由 Chrome 插件自动保存。",
    originalJd: "原始 JD",
    savedJd: "保存 JD",
    savedHtml: "HTML 备份",
    timeline: "时间线",
    addTimelineEvent: "新增时间线事件",
    notes: "备注",
    addEvent: "添加事件",
    noTimeline: "暂无事件。",
    profilePanelTitle: "个人固定信息",
    profilePanelEyebrow: "共享自动填表信息",
    profilePanelBody: "姓名、电话、住址、签证等会在所有简历中共用；邮箱仍然跟随每份简历。",
    editPersonalInfo: "编辑个人信息",
    profilesEmpty: "还没有简历档案，先上传一份简历。",
    addProfileTitle: "新增简历档案",
    editProfileTitle: "编辑简历档案",
    profileName: "档案名称",
    tags: "标签",
    resumeFile: "简历文件",
    email: "邮箱",
    phone: "电话",
    location: "地点",
    portfolio: "作品集",
    fullName: "姓名",
    firstName: "名",
    lastName: "姓",
    age: "年龄",
    dateOfBirth: "出生日期",
    address: "家庭住址",
    city: "城市",
    postcode: "邮编",
    country: "国家",
    visaStatus: "签证状态",
    sponsorship: "是否需要工作签证担保",
    rightToWork: "工作权限",
    mySkills: "我的技能",
    mySkillsHint: "用逗号分隔，例如：Python, SQL, React, AWS",
    techGapTitle: "技术栈匹配",
    techGapMatch: "已掌握",
    techGapMissing: "待补充",
    techGapNoJd: "暂无 JD 内容，无法分析技术栈。",
    techGapNoSkills: "请先在「个人固定信息」中填写「我的技能」。",
    openFile: "打开文件",
    openOriginalResume: "打开原始简历文件",
    detail: "查看详细",
    noTags: "未设置标签",
    noResumeText: "这个文件暂时没有解析出可显示文本。你仍然可以编辑上方字段，原始文件已保存在本地。",
    selectResumeFile: "请选择一份简历文件。",
    customStatusPrompt: "请输入自定义子状态",
    deleteJobConfirm: "确认删除这个岗位吗？\n\n{job}\n\n删除后会同时删除本地保存的 JD 文件夹。",
    deleteProfileConfirm: "确认删除这个简历档案吗？\n\n{name}\n\n删除后会同时删除本地简历文件。",
    summaryText: "{total} 个岗位 · {active} 个仍在流程内",
    totalApplied: "全部投递",
    enteredAssessment: "进入笔试",
    enteredInterview: "进入面试",
    rejectedTotal: "被拒总数",
    sankeyRoot: "全部投递",
    sankeyAssessment: "笔试",
    sankeyInterview: "面试",
    sankeyRejected: "被拒",
    sankeyAppliedActive: "投递中",
    sankeyAssessmentActive: "笔试中",
    sankeyInterviewActive: "面试中",
    sankeyRejectedAfterApplied: "投递被拒",
    sankeyRejectedAfterAssessment: "笔试被拒",
    sankeyRejectedAfterInterview: "面试被拒",
    weeklyReviewPeriod: "本周动态（过去 7 天）",
    applicationHeatmap: "投递热力图",
    applicationHeatmapHint: "从最早投递日期到今天，滚动查看不同月份。",
    applicationHeatmapEmpty: "还没有投递日期记录。",
    applicationsCount: "{count} 个投递",
    newThisWeek: "本周新增岗位",
    recentTimeline: "本周进展",
    staleApps: "需要跟进",
    rejectedThisWeek: "本周被拒",
    weeklyNotes: "本周总结 / 下周计划",
    weeklyNotesPreview: "已保存的复盘",
    weeklyNotesSave: "保存笔记",
    weeklyNotesSaved: "已保存",
    weeklyNotesPlaceholder: "这周整体发生了什么？哪些策略有效？下周最重要的 1-3 个动作是什么？",
    noNewApps: "本周没有新增岗位",
    noRecentTimeline: "本周没有进展动态",
    noStaleApps: "没有需要跟进的岗位",
    noRejectedThisWeek: "本周没有被拒",
    lastUpdated: "最后更新",
    followUpUrgent: "紧急",
    conversionRates: "转化率",
    responseRate: "获得回复率",
    assessmentRate: "进入笔试率",
    interviewRate: "进入面试率",
    rejectionRate: "被拒率",
    substatusDistrib: "当前状态分布",
    savedStage: "已收藏",
    appliedStage: "已投递（活跃）",
    addQuestion: "+ 新增问题",
    editQuestion: "编辑问题",
    questionTextLabel: "问题描述",
    questionCategoryLabel: "问题分类",
    answersLabel: "参考答案",
    addAnswerBtn: "+ 添加答案",
    answerLabelField: "版本名称",
    answerContentField: "答案内容",
    noAnswers: "暂无答案，点击添加。",
    noQuestions: "暂无问题，先新增一条。",
    deleteQuestionConfirm: "确认删除此问题及所有答案吗？",
    questionCount: "{count} 个问题",
    addStory: "+ 新增故事",
    editStory: "编辑故事",
    storyTitleField: "故事标题",
    storySituationLabel: "背景 (Situation)",
    storyTaskLabel: "任务 (Task)",
    storyActionLabel: "行动 (Action)",
    storyResultLabel: "结果 (Result)",
    storyNotesLabel: "面试备注",
    noStories: "暂无故事，先新增一条。",
    deleteStoryConfirm: "确认删除此故事吗？",
    storyCount: "{count} 个故事",
    addCompanyNote: "+ 新增公司笔记",
    editCompanyNote: "编辑公司笔记",
    industryLabel: "行业",
    overviewLabel: "公司介绍",
    cultureLabel: "文化 / 工作氛围",
    whyInterestedLabel: "为什么感兴趣",
    interviewFocusLabel: "面试重点",
    otherNotesLabel: "其他备注",
    linkedJobs: "关联岗位",
    noLinkedJobs: "暂无关联岗位",
    noCompanyNotes: "暂无公司笔记，先新增一条。",
    deleteCompanyNoteConfirm: "确认删除此公司笔记吗？",
    companyNoteCount: "{count} 个公司笔记",
    phQuestionCategory: "例如：motivation、behavioral、technical",
    phQuestionTags: "例如：常见题、HR 面",
    phStoryTitle: "例如：领导团队完成紧急项目",
    phStoryTags: "例如：leadership、teamwork",
    phStorySituation: "描述当时的背景和情况",
    phStoryTask: "你的任务或责任是什么",
    phStoryAction: "你采取了哪些具体行动",
    phStoryResult: "最终结果如何，有什么量化数据",
    phStoryNotes: "例如：在某公司面试中使用，反应良好",
    phCompanyIndustry: "例如：Tech、Finance、Consulting",
    phCompanyTags: "例如：大公司、初创",
    phCompanyOverview: "主营业务、产品、规模",
    phCompanyCulture: "团队氛围、工作方式、价值观",
    phCompanyWhy: "吸引你的原因，面试时用到",
    phCompanyFocus: "需要重点准备的方向",
    back: "← 返回",
    cardView: "卡片",
    listView: "列表",
    filterPlaceholder: "筛选...",
    hintQuestion: "写下这道面试题，可以是行为类、技术类或动机类问题",
    hintCategory: "用于分组和筛选，例如：behavioral、technical、motivation",
    hintAnswers: "可以为同一道题准备多个版本的回答，针对不同公司或场景使用",
    hintTags: "用逗号分隔，例如：常见题、HR面、leadership",
    hintStoryTitle: "简短概括这个故事，例如：带领团队完成紧急项目",
    hintSituation: "描述当时的背景、项目规模、团队情况和你的角色",
    hintTask: "你的具体目标或职责是什么",
    hintAction: "你采取的具体行动步骤，越细节越好，突出你的主观能动性",
    hintResult: "最终结果，尽量包含量化数据，例如：提升效率30%、节省成本",
    hintStoryNotes: "备注使用场景，例如：在某公司面试中用过，效果好",
    hintCompanyName: "与投递记录中的公司名保持一致，系统将自动关联岗位",
    hintIndustry: "例如：Tech、Finance、Healthcare",
    hintOverview: "主营业务、主要产品、公司规模和发展阶段",
    hintCulture: "团队氛围、工作方式、价值观，可从Glassdoor或官网了解",
    hintWhyInterested: "面试时几乎必问，事先整理好，和公司价值观对齐",
    hintInterviewFocus: "根据JD和同类公司经验，总结这家公司面试的侧重方向",
    prepLabel: "面试备考",
    jobPrep: "岗位备考",
    noPrepJob: "先在岗位追踪里选择一个岗位，然后点击「开始备考」。",
    prepBackToApplications: "返回岗位追踪",
    prepCardQuestion: "申请题卡片",
    prepCardStory: "面试故事卡片",
    prepNoAnswerDetail: "这条还没有保存答案内容。",
    prepBtn: "开始备考",
    prepQuestionsSection: "题目清单",
    prepStoriesSection: "故事清单",
    prepProgress: "{q}/{qTotal} 题已准备 · {s}/{sTotal} 个故事已准备",
    prepNoQuestions: "题库为空，请先在「题库」中添加题目。",
    prepNoStories: "故事库为空，请先在「故事库」中添加故事。",
  },
  en: {
    navTrack: "Track",
    navReview: "Review",
    navPrepare: "Prepare",
    navAutomation: "Automation",
    navFilters: "Filters",
    allFilter: "All",
    resetFilters: "Reset filters",
    prepareSummary: "Prepare question answers, interview stories, company notes, and resume profiles in one place.",
    dashboard: "Main Dashboard",
    dashboardSummary: "Start with the overview, then use the left index for detailed work.",
    dashboardActive: "Still active",
    dashboardRejected: "Rejected",
    dashboardAssessments: "Reached assessment",
    dashboardInterviews: "Reached interview",
    actionNeeded: "Action needed",
    noActionNeeded: "No roles need immediate action right now.",
    recentApplications: "Recent applications",
    noRecentApplications: "No recent applications yet",
    latestWeeklyNote: "Latest reflection",
    noWeeklyNote: "No saved reflection yet. Start with this week's note.",
    reviewCalendar: "Reflection calendar",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    calendarSelectedDate: "Selected date",
    dailyReviewPlaceholder: "Write the day's application reflection, interview notes, or follow-ups.",
    dailyReviewSaved: "Saved to dashboard",
    saveDailyReview: "Save daily reflection",
    noDailyReview: "No reflection for this day yet.",
    dayActivity: "Daily activity",
    jobsRecorded: "Recorded / saved",
    jobsApplied: "Applied",
    timelineActivity: "Timeline",
    weeklyReflection: "Weekly reflection",
    dailyReflection: "Daily reflection",
    noDayActivity: "No jobs or timeline activity for this day.",
    quickActions: "Next steps",
    goApplications: "Review applications",
    goWeekly: "Open weekly review",
    goQuestions: "Build question bank",
    goStories: "Build story library",
    goCompanies: "Research companies",
    applications: "Applications",
    prepare: "Prepare",
    summarize: "Funnel Analysis",
    summaryIntroTitle: "What this page is for",
    summaryIntroBody: "This is not a reflection page. It shows your application funnel: how submitted roles move into assessments, interviews, rejections, and which sub-statuses dominate. Saved roles are excluded.",
    weeklyReview: "Weekly Review",
    questionBank: "Question Bank",
    interviewStories: "Interview Stories",
    companyNotes: "Company Notes",
    resumeProfiles: "Resume Profiles",
    emailSync: "Email Sync",
    aiAssistant: "AI Assistant",
    coverLetters: "Cover Letters",
    autoApply: "Auto Apply",
    loading: "Loading...",
    newJob: "+ New Job",
    newProfile: "+ New Profile",
    languageToggle: "中文",
    searchPlaceholder: "Search company, role, links",
    refresh: "Refresh",
    tableApplyTime: "Date",
    tablePosition: "Role",
    tableCompanyCategory: "Company type",
    tableType: "Type",
    tableStage: "Stage",
    tableStatus: "Status",
    tableTimeline: "Timeline",
    tableNextAction: "Next action",
    tableDeadline: "Deadline",
    deadlineEmpty: "Choose deadline",
    deadlineManual: "Enter date manually",
    deadlineRolling: "roling base",
    deadlineDatePrompt: "Enter deadline (day/month/year)",
    tableUpdated: "Updated",
    tableActions: "Actions",
    emptyJobs: "No applications yet. Add the first one.",
    jobsCount: "{count} jobs",
    timelineCount: "{count} events",
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save",
    saveChanges: "Save changes",
    uploadSave: "Upload",
    exit: "Exit",
    close: "Close",
    addJobTitle: "New Job",
    editJobTitle: "Edit Job",
    openJdTitle: "Open JD",
    company: "Company",
    position: "Role",
    companyCategory: "Company type",
    department: "Department",
    officeLocation: "Office location",
    commuteRequirement: "Commute",
    sourceUrl: "JD page URL",
    applyUrl: "Application URL",
    applyTime: "Applied date",
    visaSponsorship: "Visa sponsorship",
    salaryRange: "Salary range",
    rotationPreference: "Rotation preference",
    applicationLimit: "Application limit",
    duplicateCheck: "Duplicate account check",
    interviewProcess: "Interview process",
    requirements: "Requirements",
    nextAction: "Next action",
    jobType: "Type",
    stage: "Stage",
    subStatus: "Sub-status",
    customSubStatus: "Custom sub-status",
    customStatusPlaceholder: "Example: waiting for HR reply",
    jdContent: "JD content",
    jdPlaceholder: "Paste the JD text here. The Chrome extension can save it later.",
    originalJd: "Original JD",
    savedJd: "Saved JD",
    savedHtml: "HTML backup",
    timeline: "Timeline",
    addTimelineEvent: "Add timeline event",
    notes: "Notes",
    addEvent: "Add event",
    noTimeline: "No events yet.",
    profilePanelTitle: "Shared personal info",
    profilePanelEyebrow: "Shared Autofill Info",
    profilePanelBody: "Name, phone, address, visa and work authorization are shared across resumes. Email stays resume-specific.",
    editPersonalInfo: "Edit personal info",
    profilesEmpty: "No Resume Profiles yet. Upload one first.",
    addProfileTitle: "New Resume Profile",
    editProfileTitle: "Edit Resume Profile",
    profileName: "Profile name",
    tags: "Tags",
    resumeFile: "Resume file",
    email: "Email",
    phone: "Phone",
    location: "Location",
    portfolio: "Portfolio",
    fullName: "Full name",
    firstName: "First name",
    lastName: "Last name",
    age: "Age",
    dateOfBirth: "Date of birth",
    address: "Address",
    city: "City",
    postcode: "Postcode",
    country: "Country",
    visaStatus: "Visa status",
    sponsorship: "Needs sponsorship",
    rightToWork: "Right to work",
    mySkills: "My Skills",
    mySkillsHint: "Comma-separated, e.g. Python, SQL, React, AWS",
    techGapTitle: "Tech Stack Match",
    techGapMatch: "I know this",
    techGapMissing: "Need to learn",
    techGapNoJd: "No JD content saved — cannot analyse tech stack.",
    techGapNoSkills: "Fill in \"My Skills\" in Personal Info first.",
    openFile: "Open file",
    openOriginalResume: "Open original resume",
    detail: "Details",
    noTags: "No tags",
    noResumeText: "No readable text was extracted from this file. You can still edit the fields above; the original file is saved locally.",
    selectResumeFile: "Please choose a resume file.",
    customStatusPrompt: "Enter a custom sub-status",
    deleteJobConfirm: "Delete this job?\n\n{job}\n\nThis will also delete the saved local JD folder.",
    deleteProfileConfirm: "Delete this Resume Profile?\n\n{name}\n\nThis will also delete the local resume file.",
    summaryText: "{total} jobs · {active} still active",
    totalApplied: "All applications",
    enteredAssessment: "Reached assessment",
    enteredInterview: "Reached interview",
    rejectedTotal: "Rejected",
    sankeyRoot: "All applications",
    sankeyAssessment: "Assessment",
    sankeyInterview: "Interview",
    sankeyRejected: "Rejected",
    sankeyAppliedActive: "Applied active",
    sankeyAssessmentActive: "Assessment active",
    sankeyInterviewActive: "Interview active",
    sankeyRejectedAfterApplied: "Application rejected",
    sankeyRejectedAfterAssessment: "Assessment rejected",
    sankeyRejectedAfterInterview: "Interview rejected",
    weeklyReviewPeriod: "This week (past 7 days)",
    applicationHeatmap: "Application heatmap",
    applicationHeatmapHint: "From your first application to today. Scroll to review other months.",
    applicationHeatmapEmpty: "No application dates recorded yet.",
    applicationsCount: "{count} applications",
    newThisWeek: "New this week",
    recentTimeline: "Progress this week",
    staleApps: "Follow up needed",
    rejectedThisWeek: "Rejected this week",
    weeklyNotes: "Weekly summary / next plan",
    weeklyNotesPreview: "Saved reflection",
    weeklyNotesSave: "Save note",
    weeklyNotesSaved: "Saved",
    weeklyNotesPlaceholder: "What happened this week? Which strategy worked? What are the top 1-3 actions for next week?",
    noNewApps: "No new applications this week",
    noRecentTimeline: "No activity logged this week",
    noStaleApps: "Nothing needs following up",
    noRejectedThisWeek: "No rejections this week",
    lastUpdated: "Last updated",
    followUpUrgent: "Urgent",
    conversionRates: "Conversion rates",
    responseRate: "Response rate",
    assessmentRate: "Assessment rate",
    interviewRate: "Interview rate",
    rejectionRate: "Rejection rate",
    substatusDistrib: "Current status breakdown",
    savedStage: "Saved",
    appliedStage: "Applied (active)",
    addQuestion: "+ New question",
    editQuestion: "Edit question",
    questionTextLabel: "Question",
    questionCategoryLabel: "Category",
    answersLabel: "Answers",
    addAnswerBtn: "+ Add answer",
    answerLabelField: "Label",
    answerContentField: "Answer",
    noAnswers: "No answers yet. Click to add.",
    noQuestions: "No questions yet. Add one to get started.",
    deleteQuestionConfirm: "Delete this question and all its answers?",
    questionCount: "{count} questions",
    addStory: "+ New story",
    editStory: "Edit story",
    storyTitleField: "Story title",
    storySituationLabel: "Situation",
    storyTaskLabel: "Task",
    storyActionLabel: "Action",
    storyResultLabel: "Result",
    storyNotesLabel: "Interview notes",
    noStories: "No stories yet. Add one to get started.",
    deleteStoryConfirm: "Delete this story?",
    storyCount: "{count} stories",
    addCompanyNote: "+ New company note",
    editCompanyNote: "Edit company note",
    industryLabel: "Industry",
    overviewLabel: "Overview",
    cultureLabel: "Culture",
    whyInterestedLabel: "Why interested",
    interviewFocusLabel: "Interview focus",
    otherNotesLabel: "Other notes",
    linkedJobs: "Linked roles",
    noLinkedJobs: "No linked roles",
    noCompanyNotes: "No company notes yet. Add one to get started.",
    deleteCompanyNoteConfirm: "Delete this company note?",
    companyNoteCount: "{count} companies",
    phQuestionCategory: "e.g. motivation, behavioral, technical",
    phQuestionTags: "e.g. common, hr, technical",
    phStoryTitle: "e.g. Led a team through a critical project",
    phStoryTags: "e.g. leadership, teamwork, conflict",
    phStorySituation: "Describe the context and background",
    phStoryTask: "What was your specific task or goal",
    phStoryAction: "What specific steps did you take",
    phStoryResult: "What was the outcome, include numbers if possible",
    phStoryNotes: "e.g. Used at a Google interview, landed well",
    phCompanyIndustry: "e.g. Tech, Finance, Consulting",
    phCompanyTags: "e.g. large corp, startup",
    phCompanyOverview: "Products, market focus, team size",
    phCompanyCulture: "Team culture, work style, values",
    phCompanyWhy: "What draws you in — use this at interviews",
    phCompanyFocus: "Key areas to prepare for this company",
    back: "← Back",
    cardView: "Cards",
    listView: "List",
    filterPlaceholder: "Filter...",
    hintQuestion: "Write out the interview question — behavioral, technical, or motivational",
    hintCategory: "Used for grouping and filtering, e.g. behavioral, technical, motivation",
    hintAnswers: "Prepare multiple answer versions for the same question",
    hintTags: "Comma-separated, e.g. common, hr, leadership",
    hintStoryTitle: "A short title for this story, e.g. Led team through critical migration",
    hintSituation: "Set the scene — project, team size, your role, what was at stake",
    hintTask: "Your specific goal or responsibility",
    hintAction: "Step-by-step actions you took — be specific, show your initiative",
    hintResult: "The outcome — ideally with numbers, e.g. improved efficiency 30%",
    hintStoryNotes: "Where you've used this story and how it landed",
    hintCompanyName: "Match the name in your Applications — the system will auto-link your roles",
    hintIndustry: "e.g. Tech, Finance, Healthcare",
    hintOverview: "Core products, market focus, company size and stage",
    hintCulture: "Team dynamics, work style, values — check Glassdoor or career page",
    hintWhyInterested: "You'll almost always be asked this — align with company values",
    hintInterviewFocus: "Based on the JD and peer experience — what does this company test for",
    prepLabel: "Interview Prep",
    jobPrep: "Role prep",
    noPrepJob: "Choose a role in Applications, then click Start prep.",
    prepBackToApplications: "Back to applications",
    prepCardQuestion: "Question card",
    prepCardStory: "Story card",
    prepNoAnswerDetail: "No answer content saved yet.",
    prepBtn: "Start prep",
    prepQuestionsSection: "Question Checklist",
    prepStoriesSection: "Story Checklist",
    prepProgress: "{q}/{qTotal} questions ready · {s}/{sTotal} stories ready",
    prepNoQuestions: "No questions yet — add some in the Question Bank first.",
    prepNoStories: "No stories yet — add some in the Story Library first.",
  },
};

const STATUS_LABELS = {
  zh: {
    ALL: "全部",
    ACTION_NEEDED: "需要行动",
    PART_TIME: "兼职",
    FULL_TIME: "全职",
    INTERNSHIP: "实习",
    SAVED: "收藏中",
    SAVED_TO_APPLIED: "评估后投递成功",
    SAVED_NOT_APPLY: "评估后不投递",
    APPLIED_SUCCESS: "投递成功等待回复",
    APPLIED_STALE: "投递后长期无反应",
    APPLIED_REJECTED: "投递阶段被拒绝",
    ASSESSMENT_INVITED: "收到笔试通知",
    ASSESSMENT_PENDING: "收到笔试通知",
    OA: "OA",
    VI: "VI",
    TECH_TEST: "技术笔试",
    ASSESSMENT_COMPLETED: "完成笔试等通知",
    ASSESSMENT_NEXT_ROUND: "进入「+1」轮笔试",
    ASSESSMENT_REJECTED: "笔试阶段被拒绝",
    INTERVIEW_INVITED: "收到面试通知",
    INTERVIEW_1: "收到面试通知",
    INTERVIEW_2: "收到面试通知",
    INTERVIEW_FINAL: "终面",
    INTERVIEW_COMPLETED: "完成面试等通知",
    INTERVIEW_NEXT_ROUND: "进入「+1」轮面试",
    INTERVIEW_REJECTED: "面试阶段被拒绝",
    OFFER: "Offer",
    REJECTED: "拒绝",
    ARCHIVED: "归档",
  },
  en: {
    ALL: "All",
    ACTION_NEEDED: "Action needed",
    PART_TIME: "Part time",
    FULL_TIME: "Full time",
    INTERNSHIP: "Internship",
    SAVED: "Saved",
    SAVED_TO_APPLIED: "Applied after review",
    SAVED_NOT_APPLY: "Archived after review",
    APPLIED_SUCCESS: "Applied, waiting",
    APPLIED_STALE: "No response after 35 days",
    APPLIED_REJECTED: "Rejected after application",
    ASSESSMENT_INVITED: "Assessment invite received",
    ASSESSMENT_PENDING: "Assessment invite received",
    OA: "OA",
    VI: "Video interview",
    TECH_TEST: "Technical test",
    ASSESSMENT_COMPLETED: "Assessment done, waiting",
    ASSESSMENT_NEXT_ROUND: "Enter +1 assessment round",
    ASSESSMENT_REJECTED: "Rejected after assessment",
    INTERVIEW_INVITED: "Interview invite received",
    INTERVIEW_1: "Interview invite received",
    INTERVIEW_2: "Interview invite received",
    INTERVIEW_FINAL: "Final interview",
    INTERVIEW_COMPLETED: "Interview done, waiting",
    INTERVIEW_NEXT_ROUND: "Enter +1 interview round",
    INTERVIEW_REJECTED: "Rejected after interview",
    OFFER: "Offer",
    REJECTED: "Rejected",
    ARCHIVED: "Archived",
  },
};

const STAGE_LABELS = {
  zh: { SAVED: "收藏", APPLIED: "投递", ASSESSMENT: "笔试", INTERVIEW: "面试", ARCHIVED: "归档" },
  en: { SAVED: "Saved", APPLIED: "Applied", ASSESSMENT: "Assessment", INTERVIEW: "Interview", ARCHIVED: "Archived" },
};

const JOB_TYPE_LABELS = {
  zh: { PART_TIME: "兼职", FULL_TIME: "全职", INTERNSHIP: "实习" },
  en: { PART_TIME: "Part time", FULL_TIME: "Full time", INTERNSHIP: "Internship" },
};

const OPTION_LABELS = {
  zh: {
    "": "未选择",
    IB_FRONT_OFFICE: "投行前台",
    IB_MIDDLE_BACK_OFFICE: "投行中后台",
    INSURANCE: "保险",
    PEVC: "PE/VC",
    STARTUP: "Startup",
    BIG_FOUR: "四大",
    CONSULTING: "咨询",
    CORPORATE: "实体企业",
    TECH: "科技公司",
    OTHER: "其他",
    ONSITE: "现场办公",
    HYBRID: "Hybrid",
    REMOTE: "Remote",
    FLEXIBLE: "灵活",
    RELOCATION: "需要搬家",
    YES: "是",
    NO: "否",
    UNCLEAR: "未说明",
    CASE_BY_CASE: "Case by case",
    NONE: "无",
    OPTIONAL: "可选",
    REQUIRED: "必填",
    RANKED_CHOICES: "需要排序志愿",
    UNKNOWN: "未知",
    NO_LIMIT: "无限制",
    ONE_ROLE: "只能投 1 个岗位",
    LIMITED_ROLES: "有限数量",
    ONE_PROGRAM: "同项目限投 1 个",
    HR_PHONE: "HR 电话",
    OA_VI: "OA / VI",
    ONE_ROUND: "一轮",
    TWO_ROUNDS: "两轮",
    THREE_ROUNDS: "三轮及以上",
    ASSESSMENT_CENTER: "Assessment Centre",
    CASE_INTERVIEW: "Case Interview",
    FINAL_ONLY: "终面",
  },
  en: {
    "": "Not selected",
    IB_FRONT_OFFICE: "IB front office",
    IB_MIDDLE_BACK_OFFICE: "IB middle/back office",
    INSURANCE: "Insurance",
    PEVC: "PE/VC",
    STARTUP: "Startup",
    BIG_FOUR: "Big Four",
    CONSULTING: "Consulting",
    CORPORATE: "Corporate",
    TECH: "Tech",
    OTHER: "Other",
    ONSITE: "Onsite",
    HYBRID: "Hybrid",
    REMOTE: "Remote",
    FLEXIBLE: "Flexible",
    RELOCATION: "Relocation",
    YES: "Yes",
    NO: "No",
    UNCLEAR: "Unclear",
    CASE_BY_CASE: "Case by case",
    NONE: "None",
    OPTIONAL: "Optional",
    REQUIRED: "Required",
    RANKED_CHOICES: "Ranked choices",
    UNKNOWN: "Unknown",
    NO_LIMIT: "No limit",
    ONE_ROLE: "One role only",
    LIMITED_ROLES: "Limited roles",
    ONE_PROGRAM: "One per programme",
    HR_PHONE: "HR phone",
    OA_VI: "OA / VI",
    ONE_ROUND: "One round",
    TWO_ROUNDS: "Two rounds",
    THREE_ROUNDS: "Three+ rounds",
    ASSESSMENT_CENTER: "Assessment centre",
    CASE_INTERVIEW: "Case interview",
    FINAL_ONLY: "Final only",
  },
};

const MODULE_TEXT = {
  zh: MODULE_VIEWS,
  en: {
    WEEKLY_REVIEW: {
      title: "Weekly Review",
      summary: "Review progress, stale applications, and next actions each week.",
      status: "Planned",
      metrics: ["New this week", "Status changes", "Stale over 7 days", "Next priorities"],
      cards: [
        ["Activity digest", "Summarize new jobs, assessments, interviews, rejections, and manual timeline events."],
        ["Stale applications", "Find applications that have not moved for a while and decide whether to follow up or archive."],
        ["Next actions", "Turn preparation, follow-ups, and review tasks into one focused page."],
      ],
    },
    QUESTION_BANK: {
      title: "Application Question Bank",
      summary: "Save common application questions and reusable answer variants.",
      status: "New feature",
      metrics: ["Question types", "Answer templates", "Role tags", "Copy to use"],
      cards: [
        ["Common questions", "Sponsorship, salary expectation, notice period, why this company, and similar prompts."],
        ["Answer variants", "Save formal, concise, technical, and graduate versions of the same answer."],
        ["Future autofill bridge", "This can later connect to autofill, but works first as a standalone answer library."],
      ],
    },
    INTERVIEW_STORIES: {
      title: "Interview Story Library",
      summary: "Manage reusable interview stories with the STAR structure.",
      status: "New feature",
      metrics: ["STAR stories", "Skill tags", "Job links", "Interview notes"],
      cards: [
        ["Story assets", "Capture leadership, teamwork, conflict, ownership, and other interview examples."],
        ["Tagged retrieval", "Filter by competency tags before an interview."],
        ["Practice notes", "Track which stories landed well and which need rewriting."],
      ],
    },
    COMPANY_NOTES: {
      title: "Company Research Notes",
      summary: "Research companies once and connect notes to related applications.",
      status: "New feature",
      metrics: ["Company profiles", "Linked roles", "Why company", "Interview focus"],
      cards: [
        ["Company profile", "Record products, culture, news, risks, and personal motivation."],
        ["Role connections", "Reuse company research across multiple roles at the same company."],
        ["Interview context", "Keep company context ready before interviews."],
      ],
    },
    EMAIL_SYNC: {
      title: "Email Sync",
      summary: "Sync recruiting emails into application timelines.",
      status: "Planned",
      metrics: ["Gmail", "Outlook", "Email type", "Manual review"],
      cards: [
        ["Inbox import", "Import confirmations, assessments, interviews, rejections, and follow-ups."],
        ["Application matching", "Start with manual confirmation to avoid mistakes across multiple roles."],
        ["Timeline updates", "Write confirmed emails to the timeline and update stage or status."],
      ],
    },
    AI_ASSISTANT: {
      title: "AI Assistant",
      summary: "Use JD, email, status, and prep material to suggest next steps.",
      status: "Planned",
      metrics: ["JD summary", "Email detection", "Match score", "Action advice"],
      cards: [
        ["JD understanding", "Extract requirements, keywords, gaps, and preparation focus."],
        ["Email classification", "Detect assessments, interviews, rejections, and follow-ups."],
        ["Workflow suggestions", "Recommend next actions from the current application state."],
      ],
    },
    COVER_LETTERS: {
      title: "Cover Letters",
      summary: "Create, save, and manage cover letter drafts by role and company.",
      status: "Planned",
      metrics: ["Drafts", "Versions", "Job links", "Export"],
      cards: [
        ["Draft workspace", "Combine JD, company notes, and resume profile into a first draft."],
        ["Version history", "Keep versions for different tones and role focuses."],
        ["Reusable snippets", "Save reusable paragraphs to reduce repeated writing."],
      ],
    },
    AUTO_APPLY: {
      title: "Auto Apply",
      summary: "A future control panel for guarded application automation.",
      status: "Long-term",
      metrics: ["Form fill", "Material choice", "Submit review", "Audit trail"],
      cards: [
        ["Guarded automation", "Autofill and material selection should still require human confirmation."],
        ["Site playbooks", "Maintain separate rules for different recruiting systems."],
        ["Audit trail", "Record each automated action into the application timeline."],
      ],
    },
  },
};

let jobs = [];
let allJobs = [];
let resumeProfiles = [];
let userProfile = {};
let questionBankItems = [];
let interviewStoryItems = [];
let companyNoteItems = [];
let questionAnswerCounter = 0;
let timelineJob = null;
let prepJob = null;
let activeEditor = null; // null | { type: "question"|"story"|"company", id: number|null, data: object|null }
let moduleViewMode = {}; // { QUESTION_BANK: "card"|"table", ... }
let moduleSearchText = {}; // { QUESTION_BANK: "", ... }
let activeView = "DASHBOARD";
let activePrepareView = "QUESTION_BANK";
let dashboardCalendarDate = new Date();
let dashboardSelectedReviewDate = new Date();
let currentLang = localStorage.getItem("jobTrackerLanguage") || "zh";
if (!I18N[currentLang]) currentLang = "zh";

const jobsTable = document.querySelector("#jobsTable");
const applicationsTableHead = document.querySelector("#applicationsView thead");
const emptyState = document.querySelector("#emptyState");
const mainTitle = document.querySelector("#mainTitle");
const summary = document.querySelector("#summary");
const toolbar = document.querySelector(".toolbar");
const searchInput = document.querySelector("#searchInput");
const refreshBtn = document.querySelector("#refreshBtn");
const newJobBtn = document.querySelector("#newJobBtn");
const exportDropdown = document.querySelector("#exportDropdown");
const exportCsvBtn = document.querySelector("#exportCsvBtn");
const exportJsonBtn = document.querySelector("#exportJsonBtn");
const languageToggle = document.querySelector("#languageToggle");
const dashboardNavButton = document.querySelector("#dashboardNavButton");
const applicationsNavButton = document.querySelector("#applicationsNavButton");
const prepareNavButton = document.querySelector("#prepareNavButton");
const dashboardView = document.querySelector("#dashboardView");
const applicationsView = document.querySelector("#applicationsView");
const summaryView = document.querySelector("#summaryView");
const moduleView = document.querySelector("#moduleView");
const summaryNavButton = document.querySelector("#summaryNavButton");
const profilesView = document.querySelector("#profilesView");
const profilesGrid = document.querySelector("#profilesGrid");
const profilesEmpty = document.querySelector("#profilesEmpty");
const profilesNavButton = document.querySelector("#profilesNavButton");
const moduleNavButtons = document.querySelectorAll("[data-module-view]");
const editPersonalInfoBtn = document.querySelector("#editPersonalInfoBtn");
const jobDialog = document.querySelector("#jobDialog");
const jobForm = document.querySelector("#jobForm");
const companyCategorySelect = document.querySelector("#companyCategorySelect");
const commuteRequirementSelect = document.querySelector("#commuteRequirementSelect");
const visaSponsorshipSelect = document.querySelector("#visaSponsorshipSelect");
const rotationPreferenceSelect = document.querySelector("#rotationPreferenceSelect");
const applicationLimitSelect = document.querySelector("#applicationLimitSelect");
const duplicateCheckSelect = document.querySelector("#duplicateCheckSelect");
const interviewProcessSelect = document.querySelector("#interviewProcessSelect");
const jobTypeSelect = document.querySelector("#jobTypeSelect");
const nextActionSelect = document.querySelector("#nextActionSelect");
const stageSelect = document.querySelector("#stageSelect");
const subStatusSelect = document.querySelector("#subStatusSelect");
const customSubStatusField = document.querySelector("#customSubStatusField");
const customSubStatusInput = document.querySelector("#customSubStatusInput");
const jdDialog = document.querySelector("#jdDialog");
const jdDialogTitle = document.querySelector("#jdDialogTitle");
const openOriginalJd = document.querySelector("#openOriginalJd");
const openSavedJd = document.querySelector("#openSavedJd");
const openSavedHtml = document.querySelector("#openSavedHtml");
const editDialog = document.querySelector("#editDialog");
const editForm = document.querySelector("#editForm");
const editJobId = document.querySelector("#editJobId");
const editCompanyName = document.querySelector("#editCompanyName");
const editPositionName = document.querySelector("#editPositionName");
const editCompanyCategorySelect = document.querySelector("#editCompanyCategorySelect");
const editDepartmentName = document.querySelector("#editDepartmentName");
const editOfficeLocation = document.querySelector("#editOfficeLocation");
const editCommuteRequirementSelect = document.querySelector("#editCommuteRequirementSelect");
const editSourceUrl = document.querySelector("#editSourceUrl");
const editApplyUrl = document.querySelector("#editApplyUrl");
const editApplyTime = document.querySelector("#editApplyTime");
const editVisaSponsorshipSelect = document.querySelector("#editVisaSponsorshipSelect");
const editSalaryRange = document.querySelector("#editSalaryRange");
const editRotationPreferenceSelect = document.querySelector("#editRotationPreferenceSelect");
const editApplicationLimitSelect = document.querySelector("#editApplicationLimitSelect");
const editDuplicateCheckSelect = document.querySelector("#editDuplicateCheckSelect");
const editInterviewProcessSelect = document.querySelector("#editInterviewProcessSelect");
const editJobTypeSelect = document.querySelector("#editJobTypeSelect");
const editNextActionSelect = document.querySelector("#editNextActionSelect");
const editStageSelect = document.querySelector("#editStageSelect");
const editSubStatusSelect = document.querySelector("#editSubStatusSelect");
const editCustomSubStatusField = document.querySelector("#editCustomSubStatusField");
const editCustomSubStatusInput = document.querySelector("#editCustomSubStatusInput");
const editRequirements = document.querySelector("#editRequirements");
const editNotes = document.querySelector("#editNotes");
const timelineDialog = document.querySelector("#timelineDialog");
const timelineDialogTitle = document.querySelector("#timelineDialogTitle");
const timelineDialogMeta = document.querySelector("#timelineDialogMeta");
const timelineForm = document.querySelector("#timelineForm");
const timelineList = document.querySelector("#timelineList");
const jobDetailDialog = document.querySelector("#jobDetailDialog");
const jobDetailTitle = document.querySelector("#jobDetailTitle");
const jobDetailMeta = document.querySelector("#jobDetailMeta");
const jobDetailContent = document.querySelector("#jobDetailContent");
const prepDialog = document.querySelector("#prepDialog");
const prepItemDialog = document.querySelector("#prepItemDialog");
const prepItemEyebrow = document.querySelector("#prepItemEyebrow");
const prepItemTitle = document.querySelector("#prepItemTitle");
const prepItemMeta = document.querySelector("#prepItemMeta");
const prepItemContent = document.querySelector("#prepItemContent");
const profileDialog = document.querySelector("#profileDialog");
const profileForm = document.querySelector("#profileForm");
const profileEditDialog = document.querySelector("#profileEditDialog");
const profileEditForm = document.querySelector("#profileEditForm");
const profileEditId = document.querySelector("#profileEditId");
const profileEditName = document.querySelector("#profileEditName");
const profileEditTags = document.querySelector("#profileEditTags");
const profileEditEmail = document.querySelector("#profileEditEmail");
const profileEditLinkedin = document.querySelector("#profileEditLinkedin");
const profileEditGithub = document.querySelector("#profileEditGithub");
const profileEditPortfolio = document.querySelector("#profileEditPortfolio");
const personalInfoDialog = document.querySelector("#personalInfoDialog");
const personalInfoForm = document.querySelector("#personalInfoForm");
const profileDetailDialog = document.querySelector("#profileDetailDialog");
const profileDetailTitle = document.querySelector("#profileDetailTitle");
const profileDetailFile = document.querySelector("#profileDetailFile");
const profileDetailText = document.querySelector("#profileDetailText");

function t(key, replacements = {}) {
  const template = I18N[currentLang][key] || I18N.zh[key] || key;
  return Object.entries(replacements).reduce(
    (value, [name, replacement]) => value.replaceAll(`{${name}}`, replacement),
    template
  );
}

function moduleText(key) {
  return MODULE_TEXT[currentLang][key] || MODULE_TEXT.zh[key];
}

function statusLabel(status) {
  return STATUS_LABELS[currentLang][status] || status;
}

function stageLabel(stage) {
  return STAGE_LABELS[currentLang][stage] || stage;
}

function roundOrdinal(round) {
  const value = Math.max(Number(round || 1), 1);
  if (currentLang === "en") {
    const suffix = value === 1 ? "st" : value === 2 ? "nd" : value === 3 ? "rd" : "th";
    return `${value}${suffix}`;
  }
  const zhNums = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
  return zhNums[value] || String(value);
}

function stageLabelForJob(job) {
  if (job.current_stage === "ASSESSMENT") {
    return currentLang === "zh"
      ? `第${roundOrdinal(job.assessment_round)}轮笔试`
      : `${roundOrdinal(job.assessment_round)} assessment`;
  }
  if (job.current_stage === "INTERVIEW") {
    if (job.status === "INTERVIEW_FINAL") return statusLabel("INTERVIEW_FINAL");
    return currentLang === "zh"
      ? `第${roundOrdinal(job.interview_round)}轮面试`
      : `${roundOrdinal(job.interview_round)} interview`;
  }
  return stageLabel(job.current_stage);
}

function jobTypeLabel(jobType) {
  return JOB_TYPE_LABELS[currentLang][jobType] || jobType || "Full time";
}

function optionLabel(value) {
  return OPTION_LABELS[currentLang][value] || value || OPTION_LABELS[currentLang][""];
}

function jobMetaText(job) {
  return [
    job.company_name,
    job.company_category ? optionLabel(job.company_category) : "",
    job.job_type ? jobTypeLabel(job.job_type) : "",
  ].filter(Boolean).join(" · ");
}

function nextActionLabel(action) {
  const labels = {
    zh: {
      DECIDE: "决定是否投",
      APPLY: "去投递",
      WAIT: "等待回复",
      FOLLOW_UP: "跟进",
      PREPARE: "准备",
      COMPLETE_TASK: "完成任务",
      ARCHIVE: "归档",
    },
    en: {
      DECIDE: "Decide",
      APPLY: "Apply",
      WAIT: "Wait",
      FOLLOW_UP: "Follow up",
      PREPARE: "Prepare",
      COMPLETE_TASK: "Complete task",
      ARCHIVE: "Archive",
    },
  };
  return labels[currentLang][action] || action || "-";
}

function isRejected(job) {
  return String(job.status || "").includes("REJECTED");
}

function isArchived(job) {
  return job.current_stage === "ARCHIVED" || job.status === "ARCHIVED";
}

function needsAction(job) {
  return ["DECIDE", "APPLY", "FOLLOW_UP", "PREPARE", "COMPLETE_TASK"].includes(job.next_action);
}

function stageForStatusValue(status, fallbackStage = "SAVED") {
  if (status === "SAVED_TO_APPLIED") return "APPLIED";
  if (status === "SAVED_NOT_APPLY" || status === "ARCHIVED") return "ARCHIVED";
  if (["APPLIED_SUCCESS", "APPLIED_STALE", "APPLIED_REJECTED"].includes(status)) return "APPLIED";
  if ([
    "ASSESSMENT_INVITED", "ASSESSMENT_PENDING", "OA", "VI", "TECH_TEST",
    "ASSESSMENT_COMPLETED", "ASSESSMENT_NEXT_ROUND", "ASSESSMENT_REJECTED",
  ].includes(status)) return "ASSESSMENT";
  if ([
    "INTERVIEW_INVITED", "INTERVIEW_1", "INTERVIEW_2", "INTERVIEW_COMPLETED",
    "INTERVIEW_NEXT_ROUND", "INTERVIEW_FINAL", "INTERVIEW_REJECTED", "OFFER",
  ].includes(status)) return "INTERVIEW";
  return fallbackStage;
}

function canonicalStatusForDisplay(status) {
  if (["ASSESSMENT_PENDING", "OA", "VI", "TECH_TEST"].includes(status)) return "ASSESSMENT_INVITED";
  if (["INTERVIEW_1", "INTERVIEW_2"].includes(status)) return "INTERVIEW_INVITED";
  return status;
}

function resolvedStageStatus(stage, status) {
  if (status === "SAVED_TO_APPLIED") return { stage: "APPLIED", status: "APPLIED_SUCCESS" };
  if (status === "SAVED_NOT_APPLY") return { stage: "ARCHIVED", status: "ARCHIVED" };
  return { stage: stageForStatusValue(status, stage), status };
}

function nextRoundPayload(job, status, resolved) {
  const payload = { status: resolved.status, current_stage: resolved.stage };
  if (status === "ASSESSMENT_NEXT_ROUND") {
    payload.assessment_round = Math.max(Number(job.assessment_round || 1) + 1, 2);
  }
  if (status === "INTERVIEW_NEXT_ROUND") {
    payload.interview_round = Math.max(Number(job.interview_round || 1) + 1, 2);
  }
  if (status === "INTERVIEW_FINAL" && job.status !== "INTERVIEW_FINAL") {
    payload.interview_round = Number(job.interview_round || 1) + 1;
  }
  return payload;
}

function deadlineMode(deadline) {
  return String(deadline || "").trim().toLowerCase() === DEADLINE_ROLLING_VALUE
    ? DEADLINE_ROLLING_VALUE
    : DEADLINE_MANUAL_VALUE;
}

function deadlineSelectHtml(job) {
  const selected = deadlineMode(job.deadline);
  const manualDeadline = job.deadline && selected === DEADLINE_MANUAL_VALUE ? job.deadline : "";
  return `
    <select class="inline-deadline" data-action="deadline" data-id="${job.id}">
      ${job.deadline ? "" : `<option value="" selected>${t("deadlineEmpty")}</option>`}
      ${manualDeadline ? `<option value="${escapeHtml(manualDeadline)}" selected>${escapeHtml(manualDeadline)}</option>` : ""}
      <option value="${DEADLINE_MANUAL_VALUE}" ${job.deadline && !manualDeadline && selected === DEADLINE_MANUAL_VALUE ? "selected" : ""}>${t("deadlineManual")}</option>
      <option value="${DEADLINE_ROLLING_VALUE}" ${selected === DEADLINE_ROLLING_VALUE ? "selected" : ""}>${t("deadlineRolling")}</option>
    </select>
  `;
}

function renderApplicationTableHead() {
  applicationsTableHead.innerHTML = `
    <tr>
      <th><span>${t("tablePosition")}</span></th>
      <th><span>${t("tableStage")}</span></th>
      <th><span>${t("tableNextAction")}</span></th>
      <th><span>${t("tableDeadline")}</span></th>
      <th><span>${t("tableUpdated")}</span></th>
      <th><span>${t("tableActions")}</span></th>
    </tr>
  `;
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function setPlaceholder(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.placeholder = value;
}

function setLeadingLabelText(selector, value) {
  const element = document.querySelector(selector);
  if (!element) return;
  const textNode = Array.from(element.childNodes).find((node) => (
    node.nodeType === Node.TEXT_NODE && node.textContent.trim()
  ));
  if (textNode) {
    textNode.textContent = `\n          ${value}\n          `;
  }
}

function setFieldLabel(formSelector, fieldName, value) {
  const field = document.querySelector(`${formSelector} [name="${fieldName}"]`);
  const label = field?.closest("label");
  if (!label) return;
  const textNode = Array.from(label.childNodes).find((node) => (
    node.nodeType === Node.TEXT_NODE && node.textContent.trim()
  ));
  if (textNode) {
    textNode.textContent = `\n            ${value}\n            `;
  }
}

function updateStaticText() {
  document.documentElement.lang = currentLang === "zh" ? "zh-Hans" : "en";
  dashboardNavButton.textContent = t("dashboard");
  applicationsNavButton.textContent = t("applications");
  prepareNavButton.textContent = t("prepare");
  document.querySelector('[data-nav-label="track"]').textContent = t("navTrack");
  document.querySelector('[data-nav-label="prepare"]').textContent = t("navPrepare");
  document.querySelector('[data-nav-label="review"]').textContent = t("navReview");
  document.querySelector('[data-nav-label="automation"]').textContent = t("navAutomation");
  summaryNavButton.textContent = t("summarize");
  const moduleButtonLabels = {
    WEEKLY_REVIEW: t("weeklyReview"),
    QUESTION_BANK: t("questionBank"),
    INTERVIEW_STORIES: t("interviewStories"),
    COMPANY_NOTES: t("companyNotes"),
    EMAIL_SYNC: t("emailSync"),
    AI_ASSISTANT: t("aiAssistant"),
    COVER_LETTERS: t("coverLetters"),
    AUTO_APPLY: t("autoApply"),
  };
  moduleNavButtons.forEach((button) => {
    button.textContent = moduleButtonLabels[button.dataset.moduleView] || button.textContent;
  });
  if (profilesNavButton) profilesNavButton.textContent = t("resumeProfiles");
  languageToggle.textContent = t("languageToggle");
  searchInput.placeholder = t("searchPlaceholder");
  refreshBtn.textContent = t("refresh");
  emptyState.textContent = t("emptyJobs");
  profilesEmpty.textContent = t("profilesEmpty");
  editPersonalInfoBtn.textContent = t("editPersonalInfo");
  renderApplicationTableHead();

  setText("#jobDialog h3", t("addJobTitle"));
  setText("#editDialog h3", t("editJobTitle"));
  setText("#jdDialogTitle", t("openJdTitle"));
  setText("#profileDialog h3", t("addProfileTitle"));
  setText("#profileEditDialog h3", t("editProfileTitle"));
  setText("#personalInfoDialog h3", t("editPersonalInfo"));
  openOriginalJd.textContent = t("originalJd");
  openSavedJd.textContent = t("savedJd");
  openSavedHtml.textContent = t("savedHtml");
  profileDetailFile.textContent = t("openOriginalResume");

  [
    ["#jobForm label:nth-of-type(1)", "company"],
    ["#jobForm label:nth-of-type(2)", "position"],
    ["#jobForm label:nth-of-type(3)", "sourceUrl"],
    ["#jobForm label:nth-of-type(4)", "applyUrl"],
    ["#jobForm label:nth-of-type(5)", "applyTime"],
    ["#jobForm label:nth-of-type(6)", "jobType"],
    ["#jobForm label:nth-of-type(7)", "stage"],
    ["#jobForm label:nth-of-type(8)", "nextAction"],
    ["#jobForm label:nth-of-type(9)", "subStatus"],
    ["#customSubStatusField", "customSubStatus"],
    ["#jobForm label:nth-of-type(11)", "jdContent"],
    ["#editForm label:nth-of-type(1)", "company"],
    ["#editForm label:nth-of-type(2)", "position"],
    ["#editForm label:nth-of-type(3)", "sourceUrl"],
    ["#editForm label:nth-of-type(4)", "applyUrl"],
    ["#editForm label:nth-of-type(5)", "applyTime"],
    ["#editForm label:nth-of-type(6)", "jobType"],
    ["#editForm label:nth-of-type(7)", "stage"],
    ["#editForm label:nth-of-type(8)", "nextAction"],
    ["#editForm label:nth-of-type(9)", "subStatus"],
    ["#editCustomSubStatusField", "customSubStatus"],
    ["#profileForm label:nth-of-type(1)", "profileName"],
    ["#profileForm label:nth-of-type(2)", "tags"],
    ["#profileForm label:nth-of-type(3)", "resumeFile"],
    ["#profileEditForm label:nth-of-type(1)", "profileName"],
    ["#profileEditForm label:nth-of-type(2)", "tags"],
    ["#personalInfoForm label:nth-of-type(1)", "fullName"],
    ["#personalInfoForm label:nth-of-type(2)", "firstName"],
    ["#personalInfoForm label:nth-of-type(3)", "lastName"],
    ["#personalInfoForm label:nth-of-type(4)", "phone"],
    ["#personalInfoForm label:nth-of-type(5)", "age"],
    ["#personalInfoForm label:nth-of-type(6)", "dateOfBirth"],
    ["#personalInfoForm label:nth-of-type(7)", "location"],
    ["#personalInfoForm label:nth-of-type(8)", "address"],
    ["#personalInfoForm label:nth-of-type(9)", "city"],
    ["#personalInfoForm label:nth-of-type(10)", "postcode"],
    ["#personalInfoForm label:nth-of-type(11)", "country"],
    ["#personalInfoForm label:nth-of-type(12)", "visaStatus"],
    ["#personalInfoForm label:nth-of-type(13)", "sponsorship"],
    ["#personalInfoForm label:nth-of-type(14)", "rightToWork"],
    ["#personalInfoForm label:nth-of-type(15)", "mySkills"],
  ].forEach(([selector, key]) => setLeadingLabelText(selector, I18N[currentLang][key] || key));

  [
    ["company_name", "company"],
    ["position_name", "position"],
    ["company_category", "companyCategory"],
    ["department_name", "department"],
    ["office_location", "officeLocation"],
    ["commute_requirement", "commuteRequirement"],
    ["source_url", "sourceUrl"],
    ["apply_url", "applyUrl"],
    ["apply_time", "applyTime"],
    ["visa_sponsorship", "visaSponsorship"],
    ["salary_range", "salaryRange"],
    ["rotation_preference", "rotationPreference"],
    ["application_limit", "applicationLimit"],
    ["duplicate_check", "duplicateCheck"],
    ["interview_process", "interviewProcess"],
    ["job_type", "jobType"],
    ["current_stage", "stage"],
    ["next_action", "nextAction"],
    ["status", "subStatus"],
    ["requirements", "requirements"],
    ["jd_content", "jdContent"],
    ["notes", "notes"],
  ].forEach(([fieldName, key]) => {
    setFieldLabel("#jobForm", fieldName, t(key));
    setFieldLabel("#editForm", fieldName, t(key));
  });

  [
    ["#profileForm", "email", t("email")],
    ["#profileForm", "linkedin", "LinkedIn"],
    ["#profileForm", "github", "GitHub"],
    ["#profileForm", "portfolio", t("portfolio")],
    ["#profileEditForm", "email", t("email")],
    ["#profileEditForm", "linkedin", "LinkedIn"],
    ["#profileEditForm", "github", "GitHub"],
    ["#profileEditForm", "portfolio", t("portfolio")],
  ].forEach(([formSelector, fieldName, value]) => setFieldLabel(formSelector, fieldName, value));

  setPlaceholder("#customSubStatusInput", t("customStatusPlaceholder"));
  setPlaceholder("#editCustomSubStatusInput", t("customStatusPlaceholder"));
  setPlaceholder('#jobForm textarea[name="jd_content"]', t("jdPlaceholder"));
  setPlaceholder('#timelineForm input[name="event_title"]', t("addTimelineEvent"));
  setPlaceholder('#timelineForm textarea[name="notes"]', t("notes"));
  setPlaceholder("#personalNeedsSponsorship", currentLang === "zh" ? "是 / 否" : "Yes / No");
  setText("#timelineDialog .eyebrow", t("timeline"));

  document.querySelectorAll('button[value="cancel"]').forEach((button) => {
    button.textContent = button.classList.contains("icon-btn") ? "×" : t("cancel");
  });
  setText("#jobForm footer .primary", t("save"));
  setText("#editForm footer .primary", t("saveChanges"));
  setText("#profileForm footer .primary", t("uploadSave"));
  setText("#profileEditForm footer .primary", t("saveChanges"));
  setText("#personalInfoForm footer .primary", t("save"));
  setText("#timelineForm .primary", t("addEvent"));

  setText(".personal-info-panel .eyebrow", t("profilePanelEyebrow"));
  setText(".personal-info-panel h3", t("profilePanelTitle"));
  setText(".personal-info-panel .muted", t("profilePanelBody"));

}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  let data;
  try {
    data = await response.json();
  } catch (_) {
    throw new Error(`HTTP ${response.status} — empty or non-JSON response from ${path}`);
  }
  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }
  return data;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result).split(",", 2)[1] || ""));
    reader.addEventListener("error", () => reject(reader.error || new Error("File read failed")));
    reader.readAsDataURL(file);
  });
}

function profileFields(profile) {
  return profile.parsed_json || {};
}

function fieldValue(profile, key) {
  return profileFields(profile)[key] || "";
}

function mergedAutofillFields(profile) {
  return { ...userProfile, ...profileFields(profile) };
}

function renderStatusControls() {
  renderStageSelect(stageSelect, "SAVED");
  renderJobTypeSelect(jobTypeSelect, "FULL_TIME");
  renderTrackingSelects();
  nextActionSelect.innerHTML = nextActionOptions("DECIDE");
  renderSubStatusSelect(subStatusSelect, "SAVED", "SAVED");
  syncApplicationFieldsForStage("SAVED", jobForm.elements.apply_time, subStatusSelect);
}

function renderStageSelect(select, value) {
  select.innerHTML = STAGE_OPTIONS.map((stage) => (
    `<option value="${stage}" ${value === stage ? "selected" : ""}>${stageLabel(stage)}</option>`
  )).join("");
}

function renderJobTypeSelect(select, value = "FULL_TIME") {
  select.innerHTML = JOB_TYPE_OPTIONS.map((jobType) => (
    `<option value="${jobType}" ${value === jobType ? "selected" : ""}>${jobTypeLabel(jobType)}</option>`
  )).join("");
}

function renderOptionalSelect(select, options, value = "") {
  if (!select) return;
  select.innerHTML = options.map((option) => (
    `<option value="${escapeHtml(option)}" ${value === option ? "selected" : ""}>${escapeHtml(optionLabel(option))}</option>`
  )).join("");
}

function renderTrackingSelects(prefix = "", job = {}) {
  const get = (key) => job[key] || "";
  if (prefix === "edit") {
    renderOptionalSelect(editCompanyCategorySelect, COMPANY_CATEGORY_OPTIONS, get("company_category"));
    renderOptionalSelect(editCommuteRequirementSelect, COMMUTE_REQUIREMENT_OPTIONS, get("commute_requirement"));
    renderOptionalSelect(editVisaSponsorshipSelect, VISA_SPONSORSHIP_OPTIONS, get("visa_sponsorship"));
    renderOptionalSelect(editRotationPreferenceSelect, ROTATION_PREFERENCE_OPTIONS, get("rotation_preference"));
    renderOptionalSelect(editApplicationLimitSelect, APPLICATION_LIMIT_OPTIONS, get("application_limit"));
    renderOptionalSelect(editDuplicateCheckSelect, DUPLICATE_CHECK_OPTIONS, get("duplicate_check"));
    renderOptionalSelect(editInterviewProcessSelect, INTERVIEW_PROCESS_OPTIONS, get("interview_process"));
    return;
  }
  renderOptionalSelect(companyCategorySelect, COMPANY_CATEGORY_OPTIONS, get("company_category"));
  renderOptionalSelect(commuteRequirementSelect, COMMUTE_REQUIREMENT_OPTIONS, get("commute_requirement"));
  renderOptionalSelect(visaSponsorshipSelect, VISA_SPONSORSHIP_OPTIONS, get("visa_sponsorship"));
  renderOptionalSelect(rotationPreferenceSelect, ROTATION_PREFERENCE_OPTIONS, get("rotation_preference"));
  renderOptionalSelect(applicationLimitSelect, APPLICATION_LIMIT_OPTIONS, get("application_limit"));
  renderOptionalSelect(duplicateCheckSelect, DUPLICATE_CHECK_OPTIONS, get("duplicate_check"));
  renderOptionalSelect(interviewProcessSelect, INTERVIEW_PROCESS_OPTIONS, get("interview_process"));
}

function nextActionOptions(value = "DECIDE") {
  return NEXT_ACTION_OPTIONS.map((action) => (
    `<option value="${action}" ${value === action ? "selected" : ""}>${nextActionLabel(action)}</option>`
  )).join("");
}

function subStatusOptionsForStage(stage, value) {
  const known = SUBSTATUS_BY_STAGE[stage] || [];
  const selectedValue = canonicalStatusForDisplay(value);
  const hasCustomValue = selectedValue && !known.includes(selectedValue);
  return [
    ...known.map((status) => (
      `<option value="${status}" ${selectedValue === status ? "selected" : ""}>${statusLabel(status)}</option>`
    )),
    hasCustomValue ? `<option value="${escapeHtml(selectedValue)}" selected>${escapeHtml(selectedValue)}</option>` : "",
  ].join("");
}

function renderSubStatusSelect(select, stage, value) {
  const field = select.closest("label");
  select.disabled = false;
  if (field) field.hidden = false;
  const fallback = (SUBSTATUS_BY_STAGE[stage] || [])[0] || "";
  select.innerHTML = subStatusOptionsForStage(stage, value || fallback);
}

function syncApplicationFieldsForStage(stage, applyInput, statusSelect) {
  const applyField = applyInput?.closest("label");
  const isSavedOrArchived = stage === "SAVED" || stage === "ARCHIVED";
  if (applyField) applyField.hidden = isSavedOrArchived;
  if (applyInput) {
    applyInput.disabled = isSavedOrArchived;
    if (isSavedOrArchived) applyInput.value = "";
  }
}

function dateInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
  }
  return date.toISOString().slice(0, 10);
}

function renderJobs() {
  summary.textContent = t("jobsCount", { count: jobs.length });
  emptyState.style.display = jobs.length ? "none" : "block";
  jobsTable.innerHTML = jobs.map((job) => `
    <tr class="${isArchived(job) ? "archived-row" : isRejected(job) ? "rejected-row" : job.current_stage === "SAVED" ? "saved-row" : ""}">
      <td>
        <button class="job-link" data-action="jd" data-id="${job.id}">
          ${escapeHtml(job.position_name)}
        </button>
        <div class="muted">${escapeHtml(jobMetaText(job))}</div>
      </td>
      <td>
        <select class="inline-status" data-action="stage" data-id="${job.id}">
          ${STAGE_OPTIONS.map((stage) => `
            <option value="${stage}" ${job.current_stage === stage ? "selected" : ""}>${stageLabel(stage)}</option>
          `).join("")}
        </select>
        <div class="muted table-subtext">${stageLabelForJob(job)}</div>
      </td>
      <td>
        <select class="inline-status" data-action="substatus" data-id="${job.id}">
          ${subStatusOptionsForStage(job.current_stage, job.status)}
        </select>
      </td>
      <td>
        ${deadlineSelectHtml(job)}
      </td>
      <td><div class="table-date">${escapeHtml(formatDate(job.updated_at || job.apply_time || job.created_at))}</div></td>
      <td>
        <div class="operation-row">
          ${["SAVED", "ARCHIVED"].includes(job.current_stage) ? "" : `<button class="prep-action-btn" data-action="prep" data-id="${job.id}">${t("prepBtn")}</button>`}
          <button data-action="detail" data-id="${job.id}">${t("detail")}</button>
        </div>
      </td>
    </tr>
  `).join("");

  jobsTable.querySelectorAll("[data-action='jd']").forEach((button) => {
    button.addEventListener("click", () => {
      const job = jobs.find((item) => String(item.id) === button.dataset.id);
      if (job) openJdDialogForJob(job);
    });
  });

  jobsTable.querySelectorAll("[data-action='stage']").forEach((select) => {
    select.addEventListener("change", async () => {
      const job = jobs.find((item) => String(item.id) === select.dataset.id);
      if (!job) return;
      const nextStage = select.value;
      const nextStatus = (SUBSTATUS_BY_STAGE[nextStage] || [])[0] || job.status;
      await patchJobFromInline(job, {
        current_stage: nextStage,
        status: nextStatus,
        apply_time: ["SAVED", "ARCHIVED"].includes(nextStage) ? "" : job.apply_time,
      });
    });
  });

  jobsTable.querySelectorAll("[data-action='jobtype']").forEach((select) => {
    select.addEventListener("change", async () => {
      const job = jobs.find((item) => String(item.id) === select.dataset.id);
      if (!job) return;
      await patchJobFromInline(job, { job_type: select.value });
    });
  });

  jobsTable.querySelectorAll("[data-action='substatus']").forEach((select) => {
    select.addEventListener("change", async () => {
      const job = jobs.find((item) => String(item.id) === select.dataset.id);
      if (!job) return;
      let nextStatus = select.value;
      if (nextStatus === CUSTOM_STATUS_VALUE) {
        nextStatus = window.prompt(t("customStatusPrompt"), job.status || "");
        if (!nextStatus || !nextStatus.trim()) {
          select.value = job.status;
          return;
        }
        nextStatus = nextStatus.trim();
      }
      const resolved = resolvedStageStatus(job.current_stage, nextStatus);
      await patchJobFromInline(job, nextRoundPayload(job, nextStatus, resolved));
    });
  });

  jobsTable.querySelectorAll("[data-action='deadline']").forEach((select) => {
    select.addEventListener("change", async () => {
      const job = jobs.find((item) => String(item.id) === select.dataset.id);
      if (!job) return;
      let nextDeadline = select.value;
      if (!nextDeadline) return;
      if (nextDeadline === DEADLINE_MANUAL_VALUE) {
        const value = window.prompt(t("deadlineDatePrompt"), deadlineMode(job.deadline) === DEADLINE_MANUAL_VALUE ? job.deadline || "" : "");
        if (!value || !value.trim()) {
          select.value = job.deadline || "";
          return;
        }
        nextDeadline = value.trim();
      }
      if (nextDeadline === (job.deadline || "")) return;
      await patchJobFromInline(job, { deadline: nextDeadline });
    });
  });

  jobsTable.querySelectorAll("[data-action='timeline']").forEach((button) => {
    button.addEventListener("click", async () => {
      const job = jobs.find((item) => String(item.id) === button.dataset.id);
      if (!job) return;
      timelineJob = job;
      await renderTimelineDialog(job);
      timelineDialog.showModal();
    });
  });

  jobsTable.querySelectorAll("[data-action='detail']").forEach((button) => {
    button.addEventListener("click", async () => {
      const job = jobs.find((item) => String(item.id) === button.dataset.id);
      if (job) await renderJobDetailDialog(job);
    });
  });

  jobsTable.querySelectorAll("[data-action='prep']").forEach((button) => {
    button.addEventListener("click", async () => {
      const job = jobs.find((item) => String(item.id) === button.dataset.id);
      if (job) await openPrepDialog(job);
    });
  });
}

async function patchJobFromInline(job, payload) {
  const updated = await api(`/api/jobs/${job.id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  jobs = jobs.map((item) => (item.id === updated.id ? { ...item, ...updated } : item));
  allJobs = allJobs.map((item) => (item.id === updated.id ? { ...item, ...updated } : item));
  if (timelineJob && timelineJob.id === updated.id) {
    timelineJob = { ...timelineJob, ...updated };
    await renderTimelineDialog(timelineJob);
  }
  renderJobs();
  return updated;
}

function renderViewShell() {
  const isDashboard = activeView === "DASHBOARD";
  const isSummary = activeView === "SUMMARY";
  const isProfiles = activeView === "PROFILES";
  const isPrepare = activeView === "PREPARE";
  const isModule = Boolean(MODULE_VIEWS[activeView]) || isPrepare;
  dashboardView.hidden = !isDashboard;
  applicationsView.hidden = isDashboard || isSummary || isProfiles || isModule;
  summaryView.hidden = !isSummary;
  profilesView.hidden = !(isProfiles || (isPrepare && activePrepareView === "PROFILES"));
  moduleView.hidden = !isModule || (isPrepare && activePrepareView === "PROFILES");
  const addContext = isPrepare ? activePrepareView : activeView;
  const moduleHasAdd = ["QUESTION_BANK", "INTERVIEW_STORIES", "COMPANY_NOTES"].includes(addContext);
  newJobBtn.hidden = isSummary || (isModule && !moduleHasAdd) || activeEditor !== null;
  if (isProfiles || (isPrepare && activePrepareView === "PROFILES")) newJobBtn.textContent = t("newProfile");
  else if (addContext === "QUESTION_BANK") newJobBtn.textContent = t("addQuestion");
  else if (addContext === "INTERVIEW_STORIES") newJobBtn.textContent = t("addStory");
  else if (addContext === "COMPANY_NOTES") newJobBtn.textContent = t("addCompanyNote");
  else newJobBtn.textContent = t("newJob");
  mainTitle.textContent = isDashboard
    ? t("dashboard")
    : isSummary
    ? t("summarize")
    : isProfiles
      ? t("resumeProfiles")
      : isPrepare
        ? t("prepare")
      : isModule
        ? t(MODULE_TITLE_KEYS[activeView])
        : t("applications");
  toolbar.hidden = activeEditor !== null;
  exportDropdown.hidden = isDashboard || isSummary || isProfiles || isModule || activeEditor !== null;
  if (isModule && !activeEditor) {
    const mod = moduleText(activeView);
    if (mod) summary.textContent = mod.summary;
  }
  dashboardNavButton.classList.toggle("active", isDashboard);
  applicationsNavButton.classList.toggle("active", activeView === "APPLICATIONS");
  prepareNavButton.classList.toggle("active", isPrepare);
  summaryNavButton.classList.toggle("active", isSummary);
  profilesNavButton?.classList.toggle("active", isProfiles);
  moduleNavButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.moduleView === activeView);
  });
}

function percent(part, total) {
  if (!total) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}

function buildSummaryStats() {
  const total = allJobs.length;
  const savedTotal = allJobs.filter((job) => job.current_stage === "SAVED").length;
  // Sankey / funnel only counts jobs that have been submitted (not saved or archived)
  const appliedJobs = allJobs.filter((job) => !["SAVED", "ARCHIVED"].includes(job.current_stage));
  const appliedTotal = appliedJobs.length;
  const appliedRejectedJobs = appliedJobs.filter((job) => job.status === "APPLIED_REJECTED");
  const assessmentTotal = appliedJobs.filter((job) => (
    job.current_stage === "ASSESSMENT" || job.current_stage === "INTERVIEW"
  )).length;
  const assessmentRejectedJobs = appliedJobs.filter((job) => job.status === "ASSESSMENT_REJECTED");
  const interviewTotal = appliedJobs.filter((job) => job.current_stage === "INTERVIEW").length;
  const interviewRejectedJobs = appliedJobs.filter((job) => job.status === "INTERVIEW_REJECTED");

  return {
    total,
    savedTotal,
    appliedTotal,
    appliedRejected: appliedRejectedJobs.length,
    assessmentTotal,
    assessmentRejected: assessmentRejectedJobs.length,
    interviewTotal,
    interviewRejected: interviewRejectedJobs.length,
    rejectedBreakdown: {
      applied: appliedRejectedJobs,
      assessment: assessmentRejectedJobs,
      interview: interviewRejectedJobs,
    },
    activeOrUnknown: Math.max(
      appliedTotal - appliedRejectedJobs.length - assessmentRejectedJobs.length - interviewRejectedJobs.length,
      0
    ),
  };
}

function sankeyNodeHeight(count, scale) {
  if (!count) return 0;
  return Math.max(34, Math.round(count * scale));
}

function sankeyFlowWidth(count, scale) {
  if (!count) return 0;
  return Math.max(6, Math.round(count * scale));
}

function stackSankeyColumn(nodes, top, height, gap = 18) {
  const visibleNodes = nodes.filter((node) => node.count > 0);
  const totalHeight = visibleNodes.reduce((sum, node) => sum + node.height, 0) + Math.max(visibleNodes.length - 1, 0) * gap;
  let y = top + Math.max((height - totalHeight) / 2, 0);
  visibleNodes.forEach((node) => {
    node.y = Math.round(y);
    y += node.height + gap;
  });
}

function initialiseSankeyOffsets(nodes, links) {
  const incoming = {};
  const outgoing = {};
  links.forEach((link) => {
    outgoing[link.source] = (outgoing[link.source] || 0) + link.width;
    incoming[link.target] = (incoming[link.target] || 0) + link.width;
  });

  nodes.forEach((node) => {
    const inHeight = incoming[node.key] || 0;
    const outHeight = outgoing[node.key] || 0;
    node._inY = node.y + Math.max((node.height - inHeight) / 2, 0);
    node._outY = node.y + Math.max((node.height - outHeight) / 2, 0);
  });
}

function sankeyFlow({ source, target, count, total, color, width, title }) {
  if (!count) return "";
  const flowWidth = Math.min(source.height, target.height, width);
  const fromY = source._outY + flowWidth / 2;
  const toY = target._inY + flowWidth / 2;
  source._outY += flowWidth;
  target._inY += flowWidth;
  const fromX = source.x + source.width;
  const toX = target.x;
  const mid = (fromX + toX) / 2;

  return `
    <path
      class="sankey-flow ${color}"
      d="M ${fromX} ${fromY} C ${mid} ${fromY}, ${mid} ${toY}, ${toX} ${toY}"
      stroke-width="${flowWidth}"
    >
      <title>${escapeHtml(title || `${count} · ${percent(count, total)}`)}</title>
    </path>
  `;
}

function sankeyNode({ x, y, width, height, title, count, total, tone = "" }) {
  return `
    <g class="sankey-node ${tone}" transform="translate(${x}, ${y})">
      <rect width="${width}" height="${height}" rx="6"></rect>
      <text x="12" y="20">${escapeHtml(title)}</text>
      <text x="12" y="42" class="node-count">${count} · ${percent(count, total)}</text>
    </g>
  `;
}

function renderSankey(stats) {
  const total = stats.appliedTotal; // SAVED jobs are not part of the funnel
  if (total === 0) {
    return `<div class="sankey-card sankey-empty"><p class="muted">投递过的岗位将在这里显示漏斗图。</p></div>`;
  }
  const appliedActive = Math.max(total - stats.assessmentTotal - stats.appliedRejected, 0);
  const assessmentActive = Math.max(stats.assessmentTotal - stats.interviewTotal - stats.assessmentRejected, 0);
  const interviewActive = Math.max(stats.interviewTotal - stats.interviewRejected, 0);
  const scale = 260 / total;
  const nodeWidth = 136;
  const diagram = { width: 900, height: 430, top: 28, bodyHeight: 350 };
  const nodes = [
    { key: "root", title: t("sankeyRoot"), count: total, x: 34, tone: "root" },
    { key: "assessment", title: t("sankeyAssessment"), count: stats.assessmentTotal, x: 258, tone: "stage" },
    { key: "appliedActive", title: t("sankeyAppliedActive"), count: appliedActive, x: 258, tone: "active" },
    { key: "appliedRejected", title: t("sankeyRejectedAfterApplied"), count: stats.appliedRejected, x: 258, tone: "rejected" },
    { key: "interview", title: t("sankeyInterview"), count: stats.interviewTotal, x: 482, tone: "stage" },
    { key: "assessmentActive", title: t("sankeyAssessmentActive"), count: assessmentActive, x: 482, tone: "active" },
    { key: "assessmentRejected", title: t("sankeyRejectedAfterAssessment"), count: stats.assessmentRejected, x: 482, tone: "rejected" },
    { key: "interviewActive", title: t("sankeyInterviewActive"), count: interviewActive, x: 706, tone: "active" },
    { key: "interviewRejected", title: t("sankeyRejectedAfterInterview"), count: stats.interviewRejected, x: 706, tone: "rejected" },
  ];
  nodes.forEach((node) => {
    node.width = nodeWidth;
    node.height = sankeyNodeHeight(node.count, scale);
  });

  stackSankeyColumn(nodes.filter((node) => node.x === 34), diagram.top, diagram.bodyHeight);
  stackSankeyColumn(nodes.filter((node) => node.x === 258), diagram.top, diagram.bodyHeight);
  stackSankeyColumn(nodes.filter((node) => node.x === 482), diagram.top, diagram.bodyHeight);
  stackSankeyColumn(nodes.filter((node) => node.x === 706), diagram.top, diagram.bodyHeight);

  const nodeMap = Object.fromEntries(nodes.map((node) => [node.key, node]));
  const links = [
    { source: "root", target: "assessment", count: stats.assessmentTotal, tone: "stage-flow", title: `${t("enteredAssessment")}: ${stats.assessmentTotal}` },
    { source: "root", target: "appliedActive", count: appliedActive, tone: "active-flow", title: `${t("sankeyAppliedActive")}: ${appliedActive}` },
    { source: "root", target: "appliedRejected", count: stats.appliedRejected, tone: "rejected-flow", title: `${t("sankeyRejectedAfterApplied")}: ${stats.appliedRejected}` },
    { source: "assessment", target: "interview", count: stats.interviewTotal, tone: "stage-flow", title: `${t("enteredInterview")}: ${stats.interviewTotal}` },
    { source: "assessment", target: "assessmentActive", count: assessmentActive, tone: "active-flow", title: `${t("sankeyAssessmentActive")}: ${assessmentActive}` },
    { source: "assessment", target: "assessmentRejected", count: stats.assessmentRejected, tone: "rejected-flow", title: `${t("sankeyRejectedAfterAssessment")}: ${stats.assessmentRejected}` },
    { source: "interview", target: "interviewActive", count: interviewActive, tone: "active-flow", title: `${t("sankeyInterviewActive")}: ${interviewActive}` },
    { source: "interview", target: "interviewRejected", count: stats.interviewRejected, tone: "rejected-flow", title: `${t("sankeyRejectedAfterInterview")}: ${stats.interviewRejected}` },
  ].filter((link) => link.count > 0);
  links.forEach((link) => {
    link.width = sankeyFlowWidth(link.count, scale);
  });
  initialiseSankeyOffsets(nodes, links);

  return `
    <div class="sankey-card">
      <svg class="sankey-diagram" viewBox="0 0 ${diagram.width} ${diagram.height}" role="img" aria-label="Application Sankey Diagram">
        <g class="sankey-flows">
          ${links.map((link) => sankeyFlow({
            source: nodeMap[link.source],
            target: nodeMap[link.target],
            count: link.count,
            total,
            color: link.tone,
            width: link.width,
            title: link.title,
          })).join("")}
        </g>

        ${nodes.filter((node) => node.count > 0).map((node) => sankeyNode({ ...node, total })).join("")}
      </svg>
    </div>
  `;
}

function renderSummaryView() {
  const stats = buildSummaryStats();
  summary.textContent = t("summaryText", { total: stats.appliedTotal, active: stats.activeOrUnknown });

  // Conversion rates are calculated from every submitted role, excluding SAVED and ARCHIVED.
  const appliedJobs = allJobs.filter((j) => !["SAVED", "ARCHIVED"].includes(j.current_stage));
  const appliedBase = appliedJobs.length;
  const totalRejected = stats.appliedRejected + stats.assessmentRejected + stats.interviewRejected;
  const gotReply = appliedJobs.filter((j) => j.status !== "APPLIED_SUCCESS").length;
  const pct = (n, d) => d > 0 ? `${Math.round((n / d) * 100)}%` : "—";

  const rateCards = [
    { label: t("responseRate"), value: pct(gotReply, appliedBase), note: `${gotReply}/${appliedBase}` },
    { label: t("assessmentRate"), value: pct(stats.assessmentTotal, appliedBase), note: `${stats.assessmentTotal}/${appliedBase}` },
    { label: t("interviewRate"), value: pct(stats.interviewTotal, appliedBase), note: `${stats.interviewTotal}/${appliedBase}` },
    { label: t("rejectionRate"), value: pct(totalRejected, appliedBase), note: `${totalRejected}/${appliedBase}` },
  ];

  // Substatus distribution — count submitted jobs per substatus, all stages
  const subCounts = {};
  appliedJobs.forEach((j) => {
    const key = j.status || "UNKNOWN";
    subCounts[key] = (subCounts[key] || 0) + 1;
  });
  const subEntries = Object.entries(subCounts)
    .sort((a, b) => b[1] - a[1])
    .filter(([k]) => k !== "UNKNOWN");
  const maxCount = subEntries.length > 0 ? subEntries[0][1] : 1;

  summaryView.innerHTML = `
    <div class="summary-panel">
      <div class="summary-intro">
        <h3>${t("summaryIntroTitle")}</h3>
        <p>${t("summaryIntroBody")}</p>
      </div>

      ${renderSankey(stats)}

      <div class="summary-metrics-grid">
        ${rateCards.map(({ label, value, note }) => `
          <div class="summary-metric-card">
            <span class="summary-metric-value">${value}</span>
            <span class="summary-metric-label">${escapeHtml(label)}</span>
            <span class="summary-metric-note">${note}</span>
          </div>`).join("")}
      </div>

      ${subEntries.length > 0 ? `
        <div class="summary-distrib">
          <h4 class="summary-distrib-title">${t("substatusDistrib")}</h4>
          ${subEntries.map(([key, count]) => `
            <div class="summary-distrib-row">
              <span class="summary-distrib-label">${escapeHtml(statusLabel(key))}</span>
              <div class="summary-distrib-bar-wrap">
                <div class="summary-distrib-bar" style="width:${Math.round((count / maxCount) * 100)}%"></div>
              </div>
              <span class="summary-distrib-count">${count}</span>
            </div>`).join("")}
        </div>` : ""}
    </div>
  `;
}

function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function dateFromKey(key) {
  const [year, month, day] = String(key || "").split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function reviewNoteKey(date) {
  return `review_note_${dateKey(date)}`;
}

function monthTitle(date) {
  return date.toLocaleDateString(currentLang === "zh" ? "zh-CN" : "en-GB", {
    year: "numeric",
    month: "long",
  });
}

function dayTitle(date) {
  return date.toLocaleDateString(currentLang === "zh" ? "zh-CN" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
  });
}

function hasDailyReviewNoteForDate(date) {
  return Boolean(String(userProfile[reviewNoteKey(date)] || "").trim());
}

function dailyActivityRows(items, meta) {
  return items.map((item) => `
    <div class="calendar-activity-row">
      <div>
        <strong>${escapeHtml(item.position_name || item.event_title)}</strong>
        <span class="muted"> · ${escapeHtml(item.company_name || "")}</span>
      </div>
      <span class="muted">${escapeHtml(meta(item))}</span>
    </div>
  `).join("");
}

function dailyActivitySection(title, items, meta) {
  if (!items.length) return "";
  return `
    <div class="calendar-activity-section">
      <h4>${title}</h4>
      <div class="calendar-activity-list">
        ${dailyActivityRows(items, meta)}
      </div>
    </div>
  `;
}

function renderActionNeededCard() {
  const items = allJobs
    .filter((job) => !isArchived(job) && needsAction(job))
    .slice(0, 6);
  const groups = ["DECIDE", "APPLY", "FOLLOW_UP", "PREPARE", "COMPLETE_TASK"]
    .map((action) => [action, items.filter((job) => job.next_action === action)])
    .filter(([, group]) => group.length);
  return `
    <article class="dashboard-card dashboard-card-wide">
      <h3>${t("actionNeeded")}</h3>
      ${groups.length ? `<div class="action-needed-groups">
        ${groups.map(([action, group]) => `
          <section class="action-needed-group">
            <h4>${nextActionLabel(action)}</h4>
            <div class="dashboard-list">
              ${group.map((job) => `
                <button type="button" data-dashboard-job="${job.id}">
                  <strong>${escapeHtml(job.position_name)}</strong>
                  <span>${escapeHtml(job.company_name)} · ${stageLabelForJob(job)}</span>
                </button>
              `).join("")}
            </div>
          </section>
        `).join("")}
      </div>` : `<p class="muted">${t("noActionNeeded")}</p>`}
    </article>
  `;
}

function renderReviewCalendar(dayData) {
  const todayKey = dateKey(new Date());
  const selectedKey = dateKey(dashboardSelectedReviewDate);
  const selectedDailyNote = userProfile[reviewNoteKey(dashboardSelectedReviewDate)] || "";
  const selectedWeeklyNote = userProfile[isoWeekKey(dashboardSelectedReviewDate)] || "";
  const month = new Date(dashboardCalendarDate.getFullYear(), dashboardCalendarDate.getMonth(), 1);
  const firstDay = month.getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const weekdayLabels = currentLang === "zh"
    ? ["日", "一", "二", "三", "四", "五", "六"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const cells = [];

  for (let i = 0; i < firstDay; i += 1) cells.push(`<span class="calendar-day is-empty"></span>`);
  for (let day = 1; day <= daysInMonth; day += 1) {
    const cellDate = new Date(month.getFullYear(), month.getMonth(), day);
    const key = dateKey(cellDate);
    const classes = [
      "calendar-day",
      key === todayKey ? "is-today" : "",
      key === selectedKey ? "is-selected" : "",
      hasDailyReviewNoteForDate(cellDate) ? "has-note" : "",
      String(userProfile[isoWeekKey(cellDate)] || "").trim() ? "has-week-note" : "",
    ].filter(Boolean).join(" ");
    cells.push(`
      <button type="button" class="${classes}" data-review-date="${key}" aria-label="${dayTitle(cellDate)}">
        <span>${day}</span>
      </button>
    `);
  }

  const recordedJobs = dayData?.recorded_jobs || [];
  const appliedJobs = dayData?.applied_jobs || [];
  const timelineEvents = dayData?.timeline_events || [];
  const hasActivity = recordedJobs.length || appliedJobs.length || timelineEvents.length;
  return `
    <article class="dashboard-card dashboard-calendar-card">
      <div class="calendar-card-header">
        <h3>${t("reviewCalendar")}</h3>
        <div class="calendar-controls">
          <button type="button" class="icon-btn" data-calendar-shift="-1" aria-label="${t("previousMonth")}">‹</button>
          <strong>${monthTitle(month)}</strong>
          <button type="button" class="icon-btn" data-calendar-shift="1" aria-label="${t("nextMonth")}">›</button>
        </div>
      </div>
      <div class="calendar-layout">
        <div class="calendar-mini">
          <div class="calendar-grid calendar-weekdays">
            ${weekdayLabels.map((label) => `<span>${label}</span>`).join("")}
          </div>
          <div class="calendar-grid">
            ${cells.join("")}
          </div>
        </div>
        <div class="calendar-day-panel">
          <div class="calendar-day-panel-header">
            <span class="muted">${t("calendarSelectedDate")}</span>
            <strong>${dayTitle(dashboardSelectedReviewDate)}</strong>
          </div>
          <div class="calendar-activity-section">
            <h4>${t("dayActivity")}</h4>
            ${hasActivity ? "" : `<p class="muted">${t("noDayActivity")}</p>`}
          </div>
          ${dailyActivitySection(t("jobsRecorded"), recordedJobs, (job) => `${stageLabelForJob(job)} · ${statusLabel(job.status)}`)}
          ${dailyActivitySection(t("jobsApplied"), appliedJobs, (job) => `${stageLabelForJob(job)} · ${statusLabel(job.status)}`)}
          ${dailyActivitySection(t("timelineActivity"), timelineEvents, (event) => `${event.position_name} · ${formatDate(event.event_time)}`)}
          <div class="calendar-note-editor">
            <h4>${t("dailyReflection")}</h4>
            <textarea id="dashboardReviewNote" rows="4" placeholder="${escapeHtml(t("dailyReviewPlaceholder"))}">${escapeHtml(selectedDailyNote)}</textarea>
            <div class="calendar-note-actions">
              <button type="button" class="primary" id="dashboardReviewSave">${t("saveDailyReview")}</button>
              <span class="muted" id="dashboardReviewStatus">${selectedDailyNote ? "" : t("noDailyReview")}</span>
            </div>
          </div>
          <div class="calendar-week-note">
            <h4>${t("weeklyReflection")}</h4>
            ${selectedWeeklyNote
              ? `<button type="button" class="dashboard-note-preview" data-dashboard-go="WEEKLY_REVIEW">${escapeHtml(selectedWeeklyNote)}</button>`
              : `<button type="button" class="dashboard-note-preview dashboard-note-empty" data-dashboard-go="WEEKLY_REVIEW">${t("noWeeklyNote")}</button>`}
          </div>
        </div>
      </div>
    </article>
  `;
}

async function renderDashboardView() {
  const stats = buildSummaryStats();
  const rejectedTotal = stats.appliedRejected + stats.assessmentRejected + stats.interviewRejected;
  const recentJobs = allJobs.slice(0, 5);
  const weeklyNote = latestWeeklyNote();
  let dayData = { recorded_jobs: [], applied_jobs: [], timeline_events: [] };
  try {
    dayData = await api(`/api/calendar-day?date=${dateKey(dashboardSelectedReviewDate)}`);
  } catch (err) {
    dayData = { recorded_jobs: [], applied_jobs: [], timeline_events: [] };
  }
  summary.textContent = t("dashboardSummary");
  dashboardView.innerHTML = `
    <section class="dashboard-grid">
      <article class="dashboard-card dashboard-card-wide">
        <div class="dashboard-metrics">
          <button type="button" data-dashboard-go="APPLICATIONS">
            <span>${t("totalApplied")}</span>
            <strong>${stats.total}</strong>
          </button>
          <button type="button" data-dashboard-go="APPLICATIONS">
            <span>${t("dashboardActive")}</span>
            <strong>${stats.activeOrUnknown}</strong>
          </button>
          <button type="button" data-dashboard-go="SUMMARY">
            <span>${t("dashboardAssessments")}</span>
            <strong>${stats.assessmentTotal}</strong>
          </button>
          <button type="button" data-dashboard-go="SUMMARY">
            <span>${t("dashboardInterviews")}</span>
            <strong>${stats.interviewTotal}</strong>
          </button>
          <button type="button" data-dashboard-go="SUMMARY">
            <span>${t("dashboardRejected")}</span>
            <strong>${rejectedTotal}</strong>
          </button>
        </div>
      </article>

      ${renderActionNeededCard()}

      <article class="dashboard-card">
        <h3>${t("recentApplications")}</h3>
        <div class="dashboard-list">
          ${recentJobs.length ? recentJobs.map((job) => `
            <button type="button" data-dashboard-job="${job.id}">
              <strong>${escapeHtml(job.position_name)}</strong>
              <span>${escapeHtml(job.company_name)} · ${stageLabelForJob(job)} · ${statusLabel(job.status)}</span>
            </button>
          `).join("") : `<p class="muted">${t("noRecentApplications")}</p>`}
        </div>
      </article>

      <article class="dashboard-card">
        <h3>${t("quickActions")}</h3>
        <div class="dashboard-list">
          <button type="button" data-dashboard-go="APPLICATIONS">${t("goApplications")}</button>
          <button type="button" data-dashboard-go="SUMMARY">${t("summarize")}</button>
          <button type="button" data-dashboard-go="PREPARE">${t("prepare")}</button>
        </div>
      </article>

      <article class="dashboard-card">
        <h3>${t("latestWeeklyNote")}</h3>
        ${weeklyNote
          ? `<button type="button" class="dashboard-note-preview" data-dashboard-go="WEEKLY_REVIEW">${escapeHtml(weeklyNote)}</button>`
          : `<button type="button" class="dashboard-note-preview dashboard-note-empty" data-dashboard-go="WEEKLY_REVIEW">${t("noWeeklyNote")}</button>`}
      </article>

      ${renderReviewCalendar(dayData)}
    </section>
  `;
  dashboardView.querySelectorAll("[data-dashboard-go]").forEach((button) => {
    button.addEventListener("click", () => {
      activeView = button.dataset.dashboardGo;
      loadJobs();
    });
  });
  dashboardView.querySelectorAll("[data-dashboard-job]").forEach((button) => {
    button.addEventListener("click", async () => {
      const job = allJobs.find((item) => String(item.id) === button.dataset.dashboardJob);
      if (!job) return;
      timelineJob = job;
      await renderTimelineDialog(job);
      timelineDialog.showModal();
    });
  });
  dashboardView.querySelectorAll("[data-calendar-shift]").forEach((button) => {
    button.addEventListener("click", async () => {
      dashboardCalendarDate = new Date(
        dashboardCalendarDate.getFullYear(),
        dashboardCalendarDate.getMonth() + Number(button.dataset.calendarShift),
        1
      );
      await renderDashboardView();
    });
  });
  dashboardView.querySelectorAll("[data-review-date]").forEach((button) => {
    button.addEventListener("click", async () => {
      const [year, month, day] = button.dataset.reviewDate.split("-").map(Number);
      dashboardSelectedReviewDate = new Date(year, month - 1, day);
      dashboardCalendarDate = new Date(year, month - 1, 1);
      await renderDashboardView();
    });
  });
  dashboardView.querySelector("#dashboardReviewSave")?.addEventListener("click", async () => {
    const textarea = dashboardView.querySelector("#dashboardReviewNote");
    const text = textarea?.value || "";
    const key = reviewNoteKey(dashboardSelectedReviewDate);
    await api("/api/user-profile", {
      method: "PATCH",
      body: JSON.stringify({ [key]: text }),
    });
    userProfile[key] = text;
    await renderDashboardView();
    const nextStatusEl = dashboardView.querySelector("#dashboardReviewStatus");
    if (nextStatusEl) nextStatusEl.textContent = t("dailyReviewSaved");
  });
}

function isoWeekKey(date = new Date()) {
  const now = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const jan4 = new Date(now.getFullYear(), 0, 4);
  const startOfWeek1 = new Date(jan4);
  startOfWeek1.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7));
  const weekNum = Math.floor((now - startOfWeek1) / (7 * 864e5)) + 1;
  return `week_note_${now.getFullYear()}_${String(weekNum).padStart(2, "0")}`;
}

function latestWeeklyNote() {
  return Object.entries(userProfile)
    .filter(([key, value]) => key.startsWith("week_note_") && String(value || "").trim())
    .sort(([a], [b]) => b.localeCompare(a))[0]?.[1] || "";
}

function weeklyJobRow(job, meta) {
  return `
    <div class="module-item-row">
      <div>
        <strong>${escapeHtml(job.position_name)}</strong>
        <span class="muted"> · ${escapeHtml(job.company_name)}</span>
      </div>
      <span class="muted">${meta}</span>
    </div>`;
}

function applicationDateKey(job) {
  if (["SAVED", "ARCHIVED"].includes(job.current_stage)) return "";
  const source = job.apply_time || job.created_at || "";
  const match = String(source).match(/^\d{4}-\d{2}-\d{2}/);
  if (match) return match[0];
  const parsed = new Date(source);
  return Number.isNaN(parsed.getTime()) ? "" : dateKey(parsed);
}

function heatmapLevel(count) {
  if (count <= 0) return "heatmap-level-0";
  if (count <= 2) return "heatmap-level-1";
  if (count <= 5) return "heatmap-level-2";
  if (count <= 10) return "heatmap-level-3";
  return "heatmap-level-4";
}

function renderApplicationHeatmap() {
  const counts = new Map();
  allJobs.forEach((job) => {
    const key = applicationDateKey(job);
    if (!key) return;
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  if (!counts.size) {
    return `
      <section class="weekly-section weekly-heatmap-section">
        <div class="weekly-section-header">
          <h3>${t("applicationHeatmap")}</h3>
        </div>
        <p class="weekly-empty">${t("applicationHeatmapEmpty")}</p>
      </section>
    `;
  }

  const today = new Date();
  const todayKey = dateKey(today);
  const earliestKey = Array.from(counts.keys()).sort()[0];
  const earliestDate = dateFromKey(earliestKey) || today;
  const currentMonthKey = dateKey(new Date(today.getFullYear(), today.getMonth(), 1));
  const earliestMonth = new Date(earliestDate.getFullYear(), earliestDate.getMonth(), 1);
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const startMonth = earliestMonth < previousMonth ? earliestMonth : previousMonth;
  const endMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const weekdayLabels = currentLang === "zh"
    ? ["日", "一", "二", "三", "四", "五", "六"]
    : ["S", "M", "T", "W", "T", "F", "S"];
  const months = [];
  let currentMonthIndex = -1;

  for (
    let cursor = new Date(startMonth);
    cursor <= endMonth;
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
  ) {
    const month = new Date(cursor);
    const monthKey = dateKey(month);
    if (monthKey === currentMonthKey) currentMonthIndex = months.length;
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < month.getDay(); i += 1) cells.push(`<span class="heatmap-day is-empty"></span>`);
    for (let day = 1; day <= daysInMonth; day += 1) {
      const cellDate = new Date(month.getFullYear(), month.getMonth(), day);
      const key = dateKey(cellDate);
      if (key > todayKey) {
        cells.push(`
          <span class="heatmap-day heatmap-future" title="${escapeHtml(dayTitle(cellDate))}">
            <span>${day}</span>
          </span>
        `);
        continue;
      }
      const count = counts.get(key) || 0;
      const label = t("applicationsCount").replace("{count}", count);
      const firstApplicationDot = key === earliestKey ? `<span class="heatmap-first-dot" aria-hidden="true"></span>` : "";
      cells.push(`
        <span class="heatmap-day ${heatmapLevel(count)}" title="${escapeHtml(`${dayTitle(cellDate)} · ${label}`)}">
          <span>${day}</span>
          ${firstApplicationDot}
        </span>
      `);
    }
    months.push(`
      <article class="heatmap-month ${monthKey === currentMonthKey ? "is-current-month" : ""}">
        <h4>${monthTitle(month)}</h4>
        <div class="heatmap-weekdays">
          ${weekdayLabels.map((label) => `<span>${label}</span>`).join("")}
        </div>
        <div class="heatmap-grid">
          ${cells.join("")}
        </div>
      </article>
    `);
  }

  if (currentMonthIndex >= 0) {
    const columnOffset = currentMonthIndex % 3;
    const spacersNeeded = columnOffset === 0 ? 1 : columnOffset === 2 ? 2 : 0;
    for (let i = 0; i < spacersNeeded; i += 1) {
      months.splice(currentMonthIndex, 0, `<span class="heatmap-month-spacer" aria-hidden="true"></span>`);
    }
  }

  return `
    <section class="weekly-section weekly-heatmap-section">
      <div class="weekly-section-header">
        <div>
          <h3>${t("applicationHeatmap")}</h3>
          <p class="weekly-heatmap-hint">${t("applicationHeatmapHint")}</p>
        </div>
      </div>
      <div class="weekly-heatmap-scroll" id="applicationHeatmapScroll">
        ${months.join("")}
      </div>
    </section>
  `;
}

async function renderWeeklyReviewView() {
  moduleView.innerHTML = `<p class="muted" style="padding:24px">加载中…</p>`;
  let data;
  try {
    data = await api("/api/weekly-review");
  } catch (err) {
    if (activeView !== "WEEKLY_REVIEW") return;
    moduleView.innerHTML = `<p style="padding:24px;color:var(--danger)">${escapeHtml(String(err))}</p>`;
    return;
  }
  if (activeView !== "WEEKLY_REVIEW") return;
  summary.textContent = t("weeklyReviewPeriod");

  const weekKey = isoWeekKey();
  const savedNote = userProfile[weekKey] || "";

  const rejectedThisWeek = data.rejected_this_week || [];
  const staleJobs = data.stale_jobs || [];
  const newJobs = data.new_jobs || [];
  const recentTimeline = data.recent_timeline || [];

  const urgentStale = staleJobs.filter((j) => ["ASSESSMENT", "INTERVIEW"].includes(j.current_stage));
  const normalStale = staleJobs.filter((j) => !["ASSESSMENT", "INTERVIEW"].includes(j.current_stage));

  function staleList(jobs) {
    return jobs.map((job) => weeklyJobRow(job,
      `${stageLabelForJob(job)} · ${t("lastUpdated")}: ${formatDate(job.updated_at)}`
    )).join("");
  }

  moduleView.innerHTML = `
    <div class="weekly-review">
      ${renderApplicationHeatmap()}

      <section class="weekly-section weekly-section-rejected">
        <div class="weekly-section-header">
          <h3>${t("rejectedThisWeek")}</h3>
          <span class="tag-count ${rejectedThisWeek.length > 0 ? "tag-count-bad" : ""}">${rejectedThisWeek.length}</span>
        </div>
        ${rejectedThisWeek.length ? `<div class="module-list">${rejectedThisWeek.map((job) =>
          weeklyJobRow(job, `${stageLabelForJob(job)} · ${statusLabel(job.status)}`)
        ).join("")}</div>` : `<p class="weekly-empty">${t("noRejectedThisWeek")}</p>`}
      </section>

      <section class="weekly-section">
        <div class="weekly-section-header">
          <h3>${t("staleApps")}</h3>
          <span class="tag-count ${urgentStale.length > 0 ? "tag-count-warn" : ""}">${staleJobs.length}</span>
        </div>
        ${staleJobs.length === 0
          ? `<p class="weekly-empty">${t("noStaleApps")}</p>`
          : `<div class="module-list">
              ${urgentStale.length > 0 ? `
                <div class="weekly-urgency-label">${t("followUpUrgent")}</div>
                ${staleList(urgentStale)}` : ""}
              ${normalStale.length > 0 ? `
                ${urgentStale.length > 0 ? `<div class="weekly-urgency-label weekly-urgency-normal">其他</div>` : ""}
                ${staleList(normalStale)}` : ""}
             </div>`}
      </section>

      <section class="weekly-section">
        <div class="weekly-section-header">
          <h3>${t("recentTimeline")}</h3>
          <span class="tag-count">${recentTimeline.length}</span>
        </div>
        ${recentTimeline.length ? `<div class="module-list">${recentTimeline.map((event) => `
          <div class="module-item-row">
            <div>
              <strong>${escapeHtml(event.event_title)}</strong>
              <span class="muted"> · ${escapeHtml(event.company_name)} · ${escapeHtml(event.position_name)}</span>
            </div>
            <span class="muted">${formatDate(event.event_time)}</span>
          </div>`).join("")}</div>` : `<p class="weekly-empty">${t("noRecentTimeline")}</p>`}
      </section>

      <section class="weekly-section">
        <div class="weekly-section-header">
          <h3>${t("newThisWeek")}</h3>
          <span class="tag-count">${newJobs.length}</span>
        </div>
        ${newJobs.length ? `<div class="module-list">${newJobs.map((job) =>
          weeklyJobRow(job, `${stageLabelForJob(job)} · ${formatDate(job.created_at)}`)
        ).join("")}</div>` : `<p class="weekly-empty">${t("noNewApps")}</p>`}
      </section>

      <section class="weekly-section weekly-section-notes">
        <div class="weekly-section-header">
          <h3>${t("weeklyNotes")}</h3>
        </div>
        <textarea class="weekly-notes-input" id="weeklyNotesInput" rows="5"
          placeholder="${escapeHtml(t("weeklyNotesPlaceholder"))}">${escapeHtml(savedNote)}</textarea>
        <div class="weekly-notes-preview" id="weeklyNotesPreview" ${savedNote ? "" : "hidden"}>
          <strong>${t("weeklyNotesPreview")}</strong>
          <p>${escapeHtml(savedNote)}</p>
        </div>
        <div class="weekly-notes-actions">
          <button class="primary" id="weeklyNotesSaveBtn">${t("weeklyNotesSave")}</button>
          <span class="weekly-notes-status muted" id="weeklyNotesStatus"></span>
        </div>
      </section>

    </div>
  `;

  const heatmapScroll = document.querySelector("#applicationHeatmapScroll");
  const currentHeatmapMonth = document.querySelector(".heatmap-month.is-current-month");
  if (heatmapScroll && currentHeatmapMonth) {
    heatmapScroll.scrollTop = Math.max(
      currentHeatmapMonth.offsetTop - ((heatmapScroll.clientHeight - currentHeatmapMonth.offsetHeight) / 2),
      0
    );
  }

  document.querySelector("#weeklyNotesSaveBtn").addEventListener("click", async () => {
    const text = document.querySelector("#weeklyNotesInput").value;
    const statusEl = document.querySelector("#weeklyNotesStatus");
    const previewEl = document.querySelector("#weeklyNotesPreview");
    await api("/api/user-profile", {
      method: "PATCH",
      body: JSON.stringify({ [weekKey]: text }),
    });
    userProfile[weekKey] = text;
    previewEl.hidden = !text.trim();
    previewEl.querySelector("p").textContent = text;
    statusEl.textContent = t("weeklyNotesSaved");
    setTimeout(() => { statusEl.textContent = ""; }, 2000);
  });
}

function addAnswerRow(container, label = "", content = "") {
  const idx = questionAnswerCounter++;
  const div = document.createElement("div");
  div.className = "answer-row";
  div.innerHTML = `
    <div class="answer-row-fields">
      <input class="answer-label-input" placeholder="${t("answerLabelField")}">
      <textarea class="answer-content-input" rows="3" placeholder="${t("answerContentField")}"></textarea>
    </div>
    <button type="button" class="icon-btn" aria-label="Remove">×</button>
  `;
  div.querySelector(".answer-label-input").value = label;
  const ta = div.querySelector(".answer-content-input");
  ta.value = content;
  ta.addEventListener("input", () => { ta.style.height = "auto"; ta.style.height = ta.scrollHeight + "px"; });
  if (content) { ta.style.height = "auto"; ta.style.height = ta.scrollHeight + "px"; }
  div.querySelector(".icon-btn").addEventListener("click", () => div.remove());
  container.appendChild(div);
}

function renderModuleToolbar(viewKey) {
  const mode = moduleViewMode[viewKey] || "card";
  const search = escapeHtml(moduleSearchText[viewKey] || "");
  return `
    <div class="module-toolbar-bar">
      <input type="text" class="module-filter-input" id="moduleFilterInput" placeholder="${t("filterPlaceholder")}" value="${search}" />
      <div class="view-mode-toggle">
        <button class="vmtoggle-btn${mode === "card" ? " active" : ""}" data-mode="card">${t("cardView")}</button>
        <button class="vmtoggle-btn${mode === "list" ? " active" : ""}" data-mode="list">${t("listView")}</button>
      </div>
    </div>`;
}

function renderPrepareTabs() {
  const tabs = [
    ["JOB_PREP", t("jobPrep")],
    ["QUESTION_BANK", t("questionBank")],
    ["INTERVIEW_STORIES", t("interviewStories")],
    ["COMPANY_NOTES", t("companyNotes")],
    ["PROFILES", t("resumeProfiles")],
  ];
  return `
    <div class="prepare-tabs">
      ${tabs.map(([key, label]) => `
        <button type="button" class="${activePrepareView === key ? "active" : ""}" data-prepare-tab="${key}">
          ${label}
        </button>
      `).join("")}
    </div>
  `;
}

function attachPrepareTabHandlers() {
  document.querySelectorAll("[data-prepare-tab]").forEach((button) => {
    button.addEventListener("click", async () => {
      activePrepareView = button.dataset.prepareTab;
      activeEditor = null;
      await loadJobs();
    });
  });
}

async function renderPrepareView() {
  summary.textContent = t("prepareSummary");
  renderViewShell();
  if (activePrepareView === "JOB_PREP") {
    await renderJobPrepView();
    moduleView.insertAdjacentHTML("afterbegin", renderPrepareTabs());
    attachPrepareTabHandlers();
    return;
  }
  if (activePrepareView === "PROFILES") {
    await loadProfiles();
    profilesView.querySelector(".prepare-tabs")?.remove();
    profilesView.insertAdjacentHTML("afterbegin", renderPrepareTabs());
    attachPrepareTabHandlers();
    return;
  }
  if (activeEditor !== null) {
    renderNoteEditor();
    return;
  }
  if (activePrepareView === "QUESTION_BANK") {
    renderQuestionBankContent();
    await renderQuestionBankView();
  } else if (activePrepareView === "INTERVIEW_STORIES") {
    renderInterviewStoriesContent();
    await renderInterviewStoriesView();
  } else if (activePrepareView === "COMPANY_NOTES") {
    renderCompanyNotesContent();
    await renderCompanyNotesView();
  }
  moduleView.insertAdjacentHTML("afterbegin", renderPrepareTabs());
  attachPrepareTabHandlers();
}

function attachModuleToolbarHandlers(viewKey, rerender) {
  document.querySelector("#moduleFilterInput")?.addEventListener("input", (e) => {
    moduleSearchText[viewKey] = e.target.value;
    rerender();
  });
  document.querySelectorAll(".vmtoggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      moduleViewMode[viewKey] = btn.dataset.mode;
      rerender();
    });
  });
}

async function renderQuestionBankView() {
  questionBankItems = await api("/api/question-bank");
  if ((activeView === "QUESTION_BANK" || (activeView === "PREPARE" && activePrepareView === "QUESTION_BANK")) && activeEditor === null) renderQuestionBankContent();
}

function renderModuleEmpty(message) {
  return `<div class="module-empty"><p class="muted">${escapeHtml(message)}</p></div>`;
}

function renderQuestionBankContent() {
  const search = (moduleSearchText.QUESTION_BANK || "").toLowerCase();
  const items = questionBankItems.filter((q) => !search ||
    q.question.toLowerCase().includes(search) ||
    (q.category || "").toLowerCase().includes(search) ||
    (q.tags || []).some((tg) => tg.toLowerCase().includes(search)));
  summary.textContent = t("questionCount", { count: items.length });
  const mode = moduleViewMode.QUESTION_BANK || "card";
  let content;
  if (mode === "list") {
    if (items.length === 0) {
      content = renderModuleEmpty(t("noQuestions"));
    } else {
      content = `<div class="module-list-view">${items.map((q) => {
        const firstAns = q.answers?.[0];
        const preview = firstAns ? (typeof firstAns === "object" ? firstAns.content : firstAns) : "";
        return `<div class="module-list-item" data-id="${q.id}">
          <span class="module-list-title">${escapeHtml(q.question)}</span>
          <div class="tag-row">${q.category && q.category !== "general" ? `<span>${escapeHtml(q.category)}</span>` : ""}${(q.tags || []).map((tg) => `<span>${escapeHtml(tg)}</span>`).join("")}</div>
          <span class="module-list-preview">${escapeHtml(String(preview).slice(0, 120))}</span>
          <div class="operation-stack"><button data-action="edit-question" data-id="${q.id}">${t("edit")}</button><button class="danger-button" data-action="delete-question" data-id="${q.id}">${t("delete")}</button></div>
        </div>`;
      }).join("")}</div>`;
    }
  } else {
    if (items.length === 0) {
      content = renderModuleEmpty(t("noQuestions"));
    } else {
      content = `<div class="module-items-grid">${items.map((q) => `
        <article class="module-item-card" data-id="${q.id}">
          <div class="module-item-header">
            <div class="module-item-body">
              <h3>${escapeHtml(q.question)}</h3>
              <div class="tag-row">
                ${q.category && q.category !== "general" ? `<span>${escapeHtml(q.category)}</span>` : ""}
                ${(q.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
              </div>
            </div>
            <div class="operation-stack item-actions">
              <button data-action="edit-question" data-id="${q.id}">${t("edit")}</button>
              <button class="danger-button" data-action="delete-question" data-id="${q.id}">${t("delete")}</button>
            </div>
          </div>
          ${(q.answers || []).length ? `
            <div class="answer-list">
              ${q.answers.map((ans) => `
                <div class="answer-item">
                  ${(typeof ans === "object" && ans.label) ? `<p class="answer-label-tag">${escapeHtml(ans.label)}</p>` : ""}
                  <p>${escapeHtml(typeof ans === "string" ? ans : (ans.content || ""))}</p>
                </div>`).join("")}
            </div>` : `<p class="muted">${t("noAnswers")}</p>`}
        </article>`).join("")}</div>`;
    }
  }
  moduleView.innerHTML = renderModuleToolbar("QUESTION_BANK") + content;
  attachModuleToolbarHandlers("QUESTION_BANK", renderQuestionBankContent);
  moduleView.querySelectorAll("[data-action='edit-question']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const q = questionBankItems.find((item) => String(item.id) === btn.dataset.id);
      if (q) openNoteEditor("question", q);
    });
  });
  moduleView.querySelectorAll("[data-action='delete-question']").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const q = questionBankItems.find((item) => String(item.id) === btn.dataset.id);
      if (!q || !window.confirm(t("deleteQuestionConfirm"))) return;
      await api(`/api/question-bank/${q.id}`, { method: "DELETE" });
      questionBankItems = questionBankItems.filter((x) => x.id !== q.id);
      renderQuestionBankContent();
    });
  });
}

async function renderInterviewStoriesView() {
  interviewStoryItems = await api("/api/interview-stories");
  if ((activeView === "INTERVIEW_STORIES" || (activeView === "PREPARE" && activePrepareView === "INTERVIEW_STORIES")) && activeEditor === null) renderInterviewStoriesContent();
}

function renderInterviewStoriesContent() {
  const search = (moduleSearchText.INTERVIEW_STORIES || "").toLowerCase();
  const items = interviewStoryItems.filter((s) => !search ||
    s.title.toLowerCase().includes(search) ||
    (s.situation || "").toLowerCase().includes(search) ||
    (s.tags || []).some((tg) => tg.toLowerCase().includes(search)));
  summary.textContent = t("storyCount", { count: items.length });
  const mode = moduleViewMode.INTERVIEW_STORIES || "card";
  let content;
  if (mode === "list") {
    if (items.length === 0) {
      content = renderModuleEmpty(t("noStories"));
    } else {
      content = `<div class="module-list-view">${items.map((s) => `
        <div class="module-list-item" data-id="${s.id}">
          <span class="module-list-title">${escapeHtml(s.title)}</span>
          <div class="tag-row">${(s.tags || []).map((tg) => `<span>${escapeHtml(tg)}</span>`).join("")}</div>
          <span class="module-list-preview">${escapeHtml((s.situation || "").slice(0, 120))}</span>
          <div class="operation-stack"><button data-action="edit-story" data-id="${s.id}">${t("edit")}</button><button class="danger-button" data-action="delete-story" data-id="${s.id}">${t("delete")}</button></div>
        </div>`).join("")}</div>`;
    }
  } else {
    if (items.length === 0) {
      content = renderModuleEmpty(t("noStories"));
    } else {
      content = `<div class="module-items-grid">${items.map((story) => `
        <article class="module-item-card" data-id="${story.id}">
          <div class="module-item-header">
            <div class="module-item-body">
              <h3>${escapeHtml(story.title)}</h3>
              <div class="tag-row">
                ${(story.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
              </div>
            </div>
            <div class="operation-stack item-actions">
              <button data-action="edit-story" data-id="${story.id}">${t("edit")}</button>
              <button class="danger-button" data-action="delete-story" data-id="${story.id}">${t("delete")}</button>
            </div>
          </div>
          <div class="star-grid">
            ${story.situation ? `<div class="star-field"><dt>${t("storySituationLabel")}</dt><dd>${escapeHtml(story.situation)}</dd></div>` : ""}
            ${story.task ? `<div class="star-field"><dt>${t("storyTaskLabel")}</dt><dd>${escapeHtml(story.task)}</dd></div>` : ""}
            ${story.action ? `<div class="star-field"><dt>${t("storyActionLabel")}</dt><dd>${escapeHtml(story.action)}</dd></div>` : ""}
            ${story.result ? `<div class="star-field"><dt>${t("storyResultLabel")}</dt><dd>${escapeHtml(story.result)}</dd></div>` : ""}
          </div>
          ${story.notes ? `<p class="story-notes muted">${escapeHtml(story.notes)}</p>` : ""}
        </article>`).join("")}</div>`;
    }
  }
  moduleView.innerHTML = renderModuleToolbar("INTERVIEW_STORIES") + content;
  attachModuleToolbarHandlers("INTERVIEW_STORIES", renderInterviewStoriesContent);
  moduleView.querySelectorAll("[data-action='edit-story']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const story = interviewStoryItems.find((item) => String(item.id) === btn.dataset.id);
      if (story) openNoteEditor("story", story);
    });
  });
  moduleView.querySelectorAll("[data-action='delete-story']").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const story = interviewStoryItems.find((item) => String(item.id) === btn.dataset.id);
      if (!story || !window.confirm(t("deleteStoryConfirm"))) return;
      await api(`/api/interview-stories/${story.id}`, { method: "DELETE" });
      interviewStoryItems = interviewStoryItems.filter((x) => x.id !== story.id);
      renderInterviewStoriesContent();
    });
  });
}

async function renderCompanyNotesView() {
  companyNoteItems = await api("/api/company-notes");
  if ((activeView === "COMPANY_NOTES" || (activeView === "PREPARE" && activePrepareView === "COMPANY_NOTES")) && activeEditor === null) renderCompanyNotesContent();
}

function renderCompanyNotesContent() {
  const search = (moduleSearchText.COMPANY_NOTES || "").toLowerCase();
  const items = companyNoteItems.filter((n) => !search ||
    n.company_name.toLowerCase().includes(search) ||
    (n.industry || "").toLowerCase().includes(search) ||
    (n.tags || []).some((tg) => tg.toLowerCase().includes(search)));
  summary.textContent = t("companyNoteCount", { count: items.length });
  const mode = moduleViewMode.COMPANY_NOTES || "card";
  let content;
  if (mode === "list") {
    if (items.length === 0) {
      content = renderModuleEmpty(t("noCompanyNotes"));
    } else {
      content = `<div class="module-list-view">${items.map((note) => {
        const linked = allJobs.filter((j) => j.company_name.toLowerCase() === note.company_name.toLowerCase());
        const preview = note.overview || note.why_interested || "";
        return `<div class="module-list-item" data-id="${note.id}">
          <span class="module-list-title">${escapeHtml(note.company_name)}</span>
          <div class="tag-row">${note.industry ? `<span>${escapeHtml(note.industry)}</span>` : ""}${(note.tags || []).map((tg) => `<span>${escapeHtml(tg)}</span>`).join("")}</div>
          <span class="module-list-preview">${escapeHtml(preview.slice(0, 120))}${linked.length ? ` · ${linked.length} role${linked.length > 1 ? "s" : ""}` : ""}</span>
          <div class="operation-stack"><button data-action="edit-company" data-id="${note.id}">${t("edit")}</button><button class="danger-button" data-action="delete-company" data-id="${note.id}">${t("delete")}</button></div>
        </div>`;
      }).join("")}</div>`;
    }
  } else {
    if (items.length === 0) {
      content = renderModuleEmpty(t("noCompanyNotes"));
    } else {
      content = `<div class="module-items-grid">${items.map((note) => {
        const linked = allJobs.filter((job) => job.company_name.toLowerCase() === note.company_name.toLowerCase());
        return `
          <article class="module-item-card" data-id="${note.id}">
            <div class="module-item-header">
              <div class="module-item-body">
                <h3>${escapeHtml(note.company_name)}</h3>
                <div class="tag-row">
                  ${note.industry ? `<span>${escapeHtml(note.industry)}</span>` : ""}
                  ${(note.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
                </div>
              </div>
              <div class="operation-stack item-actions">
                <button data-action="edit-company" data-id="${note.id}">${t("edit")}</button>
                <button class="danger-button" data-action="delete-company" data-id="${note.id}">${t("delete")}</button>
              </div>
            </div>
            ${note.overview ? `<p>${escapeHtml(note.overview)}</p>` : ""}
            ${note.why_interested ? `<div class="note-field"><dt>${t("whyInterestedLabel")}</dt><dd>${escapeHtml(note.why_interested)}</dd></div>` : ""}
            ${note.interview_focus ? `<div class="note-field"><dt>${t("interviewFocusLabel")}</dt><dd>${escapeHtml(note.interview_focus)}</dd></div>` : ""}
            <div class="linked-jobs-row">
              <span class="muted">${t("linkedJobs")}:</span>
              ${linked.length ? linked.map((job) => `<span class="linked-job-tag">${escapeHtml(job.position_name)}</span>`).join("") : `<span class="muted">${t("noLinkedJobs")}</span>`}
            </div>
          </article>`;
      }).join("")}</div>`;
    }
  }
  moduleView.innerHTML = renderModuleToolbar("COMPANY_NOTES") + content;
  attachModuleToolbarHandlers("COMPANY_NOTES", renderCompanyNotesContent);
  moduleView.querySelectorAll("[data-action='edit-company']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const note = companyNoteItems.find((item) => String(item.id) === btn.dataset.id);
      if (note) openNoteEditor("company", note);
    });
  });
  moduleView.querySelectorAll("[data-action='delete-company']").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const note = companyNoteItems.find((item) => String(item.id) === btn.dataset.id);
      if (!note || !window.confirm(t("deleteCompanyNoteConfirm"))) return;
      await api(`/api/company-notes/${note.id}`, { method: "DELETE" });
      companyNoteItems = companyNoteItems.filter((x) => x.id !== note.id);
      renderCompanyNotesContent();
    });
  });
}

const TECH_KEYWORDS = [
  // Languages
  "Python","JavaScript","TypeScript","Java","C++","C#","C","Go","Golang","Rust","Ruby","PHP","Swift","Kotlin","Scala","R","MATLAB","Perl","Bash","Shell","PowerShell","SQL","PL/SQL","T-SQL","Haskell","Elixir","Clojure","Dart","Lua","Julia",
  // Web frontend
  "React","Vue","Angular","Svelte","Next.js","Nuxt","HTML","CSS","SASS","SCSS","Tailwind","Bootstrap","jQuery","Redux","Zustand","Webpack","Vite","Rollup","Babel","GraphQL","REST","WebSocket","PWA",
  // Web backend
  "Node.js","Express","FastAPI","Django","Flask","Spring","Spring Boot","Rails","Laravel","ASP.NET",".NET","NestJS","Koa","Gin","Echo","Fiber","gRPC",
  // Databases
  "MySQL","PostgreSQL","SQLite","MongoDB","Redis","Elasticsearch","Cassandra","DynamoDB","Firestore","BigQuery","Snowflake","Redshift","Oracle","MariaDB","CockroachDB","Neo4j","InfluxDB","Kafka","RabbitMQ","Celery",
  // Cloud & DevOps
  "AWS","Azure","GCP","Docker","Kubernetes","Terraform","Ansible","Jenkins","GitHub Actions","CircleCI","GitLab CI","ArgoCD","Helm","Prometheus","Grafana","Datadog","Splunk","ECS","EKS","Lambda","EC2","S3","CloudFormation","Pulumi","Nginx","Apache",
  // Data & ML
  "Pandas","NumPy","Scikit-learn","TensorFlow","PyTorch","Keras","XGBoost","LightGBM","Spark","Hadoop","Airflow","dbt","Tableau","Power BI","Looker","Databricks","Jupyter","Matplotlib","Seaborn","Plotly","MLflow","Hugging Face","LangChain","OpenAI",
  // Mobile
  "React Native","Flutter","SwiftUI","Android","iOS","Expo","Cordova","Ionic",
  // Tools & Practices
  "Git","GitHub","GitLab","Bitbucket","Jira","Confluence","Figma","Postman","Swagger","OpenAPI","Agile","Scrum","Kanban","CI/CD","TDD","BDD","Microservices","Serverless","Event-driven","SOA","OAuth","JWT","SAML","Linux","Unix",
];

function extractTechFromJd(jdText) {
  if (!jdText) return [];
  const lower = jdText.toLowerCase();
  return TECH_KEYWORDS.filter((kw) => {
    const lk = kw.toLowerCase();
    const idx = lower.indexOf(lk);
    if (idx === -1) return false;
    const before = idx > 0 ? lower[idx - 1] : " ";
    const after = idx + lk.length < lower.length ? lower[idx + lk.length] : " ";
    return !/[a-z0-9_-]/.test(before) && !/[a-z0-9_-]/.test(after);
  });
}

function renderPrepQuestionPreview(question) {
  const first = question.answers?.[0];
  if (!first) return "";
  const content = typeof first === "string" ? first : first.content || "";
  return content ? `${escapeHtml(content.slice(0, 90))}${content.length > 90 ? "..." : ""}` : "";
}

function openPrepItemCard(type, item) {
  const isQuestion = type === "question";
  prepItemEyebrow.textContent = isQuestion ? t("prepCardQuestion") : t("prepCardStory");
  prepItemTitle.textContent = isQuestion ? item.question : item.title;
  prepItemMeta.textContent = (item.tags || []).join(" · ") || (isQuestion ? item.category || "" : "");

  if (isQuestion) {
    const answers = item.answers || [];
    prepItemContent.innerHTML = `
      <div class="prep-card-detail">
        <div class="tag-row">
          ${item.category && item.category !== "general" ? `<span>${escapeHtml(item.category)}</span>` : ""}
          ${(item.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
        </div>
        ${answers.length ? `
          <div class="answer-list">
            ${answers.map((answer) => `
              <div class="answer-item">
                ${(typeof answer === "object" && answer.label) ? `<p class="answer-label-tag">${escapeHtml(answer.label)}</p>` : ""}
                <p>${escapeHtml(typeof answer === "string" ? answer : answer.content || "")}</p>
              </div>
            `).join("")}
          </div>
        ` : `<p class="muted">${t("prepNoAnswerDetail")}</p>`}
      </div>
    `;
  } else {
    prepItemContent.innerHTML = `
      <dl class="prep-card-detail star-grid">
        ${item.situation ? `<div class="star-field"><dt>${t("storySituationLabel")}</dt><dd>${escapeHtml(item.situation)}</dd></div>` : ""}
        ${item.task ? `<div class="star-field"><dt>${t("storyTaskLabel")}</dt><dd>${escapeHtml(item.task)}</dd></div>` : ""}
        ${item.action ? `<div class="star-field"><dt>${t("storyActionLabel")}</dt><dd>${escapeHtml(item.action)}</dd></div>` : ""}
        ${item.result ? `<div class="star-field"><dt>${t("storyResultLabel")}</dt><dd>${escapeHtml(item.result)}</dd></div>` : ""}
      </dl>
      ${item.notes ? `<p class="story-notes muted">${escapeHtml(item.notes)}</p>` : ""}
    `;
  }
  prepItemDialog.showModal();
}

async function openPrepDialog(job) {
  prepJob = job;
  activeView = "PREPARE";
  activePrepareView = "JOB_PREP";
  activeEditor = null;
  await loadJobs();
}

async function renderPrepDialog(target = document) {
  if (!prepJob) return;
  const data = await api(`/api/jobs/${prepJob.id}/prep`);

  target.querySelector("#prepDialogTitle").textContent = prepJob.position_name;
  target.querySelector("#prepDialogMeta").textContent =
    `${prepJob.company_name} · ${stageLabelForJob(prepJob)} · ${statusLabel(prepJob.status)}`;
  target.querySelector("#prepDialogEyebrow").textContent = t("prepLabel");

  const totalItems = data.questions.length + data.stories.length;
  const readyQ = data.questions.filter((q) => q.is_ready).length;
  const readyS = data.stories.filter((s) => s.is_ready).length;
  const totalReady = readyQ + readyS;
  const pct = totalItems > 0 ? Math.round((totalReady / totalItems) * 100) : 0;

  target.querySelector("#prepProgress").innerHTML = `
    <div class="prep-progress">
      <span class="prep-progress-text">${t("prepProgress", { q: readyQ, qTotal: data.questions.length, s: readyS, sTotal: data.stories.length })}</span>
      <div class="prep-bar"><div class="prep-bar-fill" style="width:${pct}%"></div></div>
    </div>`;

  const byCategory = {};
  data.questions.forEach((q) => {
    const cat = q.category || "general";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(q);
  });

  const qHtml = data.questions.length === 0
    ? `<p class="prep-empty">${t("prepNoQuestions")}</p>`
    : Object.entries(byCategory).map(([cat, qs]) => `
        <div class="prep-category">
          <div class="prep-category-label">${escapeHtml(cat)}</div>
          ${qs.map((q) => `
            <article class="prep-item prep-item-card${q.is_ready ? " is-ready" : ""}" data-prep-card="question" data-id="${q.id}">
              <input type="checkbox" class="prep-check" data-type="question" data-id="${q.id}" ${q.is_ready ? "checked" : ""} />
              <button type="button" class="prep-card-open" data-prep-card="question" data-id="${q.id}">
                <span class="prep-item-text">${escapeHtml(q.question)}</span>
                ${renderPrepQuestionPreview(q) ? `<span class="prep-item-hint">${renderPrepQuestionPreview(q)}</span>` : ""}
                ${q.tags.length ? `<span class="prep-item-tags">${q.tags.map((tg) => `<span class="tag-chip">${escapeHtml(tg)}</span>`).join("")}</span>` : ""}
              </button>
            </article>`).join("")}
        </div>`).join("");

  const sHtml = data.stories.length === 0
    ? `<p class="prep-empty">${t("prepNoStories")}</p>`
    : data.stories.map((s) => `
        <article class="prep-item prep-item-card${s.is_ready ? " is-ready" : ""}" data-prep-card="story" data-id="${s.id}">
          <input type="checkbox" class="prep-check" data-type="story" data-id="${s.id}" ${s.is_ready ? "checked" : ""} />
          <button type="button" class="prep-card-open" data-prep-card="story" data-id="${s.id}">
            <span class="prep-item-text">${escapeHtml(s.title)}</span>
            ${s.situation ? `<span class="prep-item-hint">${escapeHtml(s.situation.slice(0, 90))}${s.situation.length > 90 ? "..." : ""}</span>` : ""}
            ${s.tags.length ? `<span class="prep-item-tags">${s.tags.map((tg) => `<span class="tag-chip">${escapeHtml(tg)}</span>`).join("")}</span>` : ""}
          </button>
        </article>`).join("");

  // Tech gap analysis
  const jdText = prepJob.jd_content || "";
  const mySkillsRaw = (userProfile.my_skills || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  let techGapHtml = "";
  if (!jdText) {
    techGapHtml = `<p class="prep-empty">${t("techGapNoJd")}</p>`;
  } else {
    const jdKeywords = extractTechFromJd(jdText);
    if (jdKeywords.length === 0) {
      techGapHtml = `<p class="prep-empty muted">JD 中未检测到常见技术关键词。</p>`;
    } else {
      const matched = jdKeywords.filter((kw) => mySkillsRaw.some((s) => s === kw.toLowerCase() || kw.toLowerCase().includes(s) || s.includes(kw.toLowerCase())));
      const missing = jdKeywords.filter((kw) => !mySkillsRaw.some((s) => s === kw.toLowerCase() || kw.toLowerCase().includes(s) || s.includes(kw.toLowerCase())));
      const matchPct = jdKeywords.length > 0 ? Math.round((matched.length / jdKeywords.length) * 100) : 0;
      const noSkills = mySkillsRaw.length === 0;
      techGapHtml = `
        <div class="tech-gap-bar-row">
          <span class="tech-gap-score">${noSkills ? "—" : `${matchPct}%`}</span>
          <div class="prep-bar tech-gap-bar"><div class="prep-bar-fill" style="width:${noSkills ? 0 : matchPct}%"></div></div>
          <span class="tech-gap-total">${jdKeywords.length} 个关键词</span>
        </div>
        ${noSkills ? `<p class="prep-empty muted">${t("techGapNoSkills")}</p>` : ""}
        ${missing.length > 0 ? `
          <div class="tech-gap-group">
            <span class="tech-gap-label tech-gap-missing-label">${t("techGapMissing")} (${missing.length})</span>
            <div class="tech-gap-chips">
              ${missing.map((kw) => `<span class="tech-chip tech-chip-missing">${escapeHtml(kw)}</span>`).join("")}
            </div>
          </div>` : ""}
        ${matched.length > 0 ? `
          <div class="tech-gap-group">
            <span class="tech-gap-label tech-gap-match-label">${t("techGapMatch")} (${matched.length})</span>
            <div class="tech-gap-chips">
              ${matched.map((kw) => `<span class="tech-chip tech-chip-match">${escapeHtml(kw)}</span>`).join("")}
            </div>
          </div>` : ""}`;
    }
  }

  target.querySelector("#prepContent").innerHTML = `
    <div class="prep-sections">
      <div class="prep-section prep-section-tech">
        <h4 class="prep-section-title">${t("techGapTitle")}</h4>
        ${techGapHtml}
      </div>
      <div class="prep-section">
        <h4 class="prep-section-title">${t("prepQuestionsSection")}</h4>
        ${qHtml}
      </div>
      <div class="prep-section">
        <h4 class="prep-section-title">${t("prepStoriesSection")}</h4>
        ${sHtml}
      </div>
    </div>`;

  target.querySelectorAll(".prep-check").forEach((cb) => {
    cb.addEventListener("change", async () => {
      const isReady = cb.checked ? 1 : 0;
      await api(`/api/jobs/${prepJob.id}/prep`, {
        method: "POST",
        body: JSON.stringify({ item_type: cb.dataset.type, item_id: parseInt(cb.dataset.id), is_ready: isReady }),
      });
      cb.closest(".prep-item")?.classList.toggle("is-ready", cb.checked);
      const allQ = target.querySelectorAll('.prep-check[data-type="question"]');
      const allS = target.querySelectorAll('.prep-check[data-type="story"]');
      const rQ = [...allQ].filter((c) => c.checked).length;
      const rS = [...allS].filter((c) => c.checked).length;
      const tot = allQ.length + allS.length;
      const rdy = rQ + rS;
      target.querySelector(".prep-progress-text").textContent =
        t("prepProgress", { q: rQ, qTotal: allQ.length, s: rS, sTotal: allS.length });
      target.querySelector(".prep-bar-fill").style.width = tot > 0 ? `${Math.round((rdy / tot) * 100)}%` : "0%";
    });
  });
  target.querySelectorAll(".prep-card-open").forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.prepCard;
      const source = type === "question" ? data.questions : data.stories;
      const item = source.find((entry) => String(entry.id) === button.dataset.id);
      if (item) openPrepItemCard(type, item);
    });
  });
}

async function renderJobPrepView() {
  if (!prepJob) {
    moduleView.innerHTML = `
      <section class="prep-workspace-empty">
        <h3>${t("jobPrep")}</h3>
        <p class="muted">${t("noPrepJob")}</p>
        <button type="button" class="primary" data-prep-back>${t("prepBackToApplications")}</button>
      </section>
    `;
    moduleView.querySelector("[data-prep-back]")?.addEventListener("click", () => {
      activeView = "APPLICATIONS";
      loadJobs();
    });
    return;
  }

  moduleView.innerHTML = `
    <section class="prep-workspace">
      <header>
        <div>
          <p class="eyebrow" id="prepDialogEyebrow">${t("prepLabel")}</p>
          <h3 id="prepDialogTitle">${escapeHtml(prepJob.position_name)}</h3>
          <p class="muted" id="prepDialogMeta">${escapeHtml(prepJob.company_name)}</p>
        </div>
        <button type="button" data-prep-back>${t("prepBackToApplications")}</button>
      </header>
      <div id="prepProgress"></div>
      <div id="prepContent"><p class="prep-empty muted">${t("loading")}</p></div>
    </section>
  `;
  moduleView.querySelector("[data-prep-back]")?.addEventListener("click", () => {
    activeView = "APPLICATIONS";
    loadJobs();
  });
  try {
    await renderPrepDialog(moduleView);
  } catch (err) {
    moduleView.querySelector("#prepContent").innerHTML = `<p class="prep-empty" style="color:var(--danger)">${escapeHtml(String(err))}</p>`;
  }
}

function openNoteEditor(type, item = null) {
  activeEditor = { type, id: item?.id ?? null, data: item };
  loadJobs();
}

function getNoteEditorFields(type, data) {
  const h = (s) => escapeHtml(String(s ?? ""));
  const tagStr = (v) => Array.isArray(v) ? v.join(", ") : (v || "");
  if (type === "question") {
    return `
      <div class="note-field">
        <div class="note-field-label">
          <span>${t("questionTextLabel")}</span>
          <span class="note-hint" data-hint="${h(t("hintQuestion"))}">?</span>
        </div>
        <textarea name="question" class="note-field-input" rows="4" required>${h(data?.question)}</textarea>
      </div>
      <div class="note-field">
        <div class="note-field-label">
          <span>${t("questionCategoryLabel")}</span>
          <span class="note-hint" data-hint="${h(t("hintCategory"))}">?</span>
        </div>
        <input name="category" class="note-field-input" value="${h(data?.category)}" placeholder="${h(t("phQuestionCategory"))}" />
      </div>
      <div class="note-field">
        <div class="note-field-label">
          <span>${t("tags")}</span>
          <span class="note-hint" data-hint="${h(t("hintTags"))}">?</span>
        </div>
        <input name="tags" class="note-field-input" value="${h(tagStr(data?.tags))}" placeholder="${h(t("phQuestionTags"))}" />
      </div>
      <div class="note-field">
        <div class="note-field-label">
          <span>${t("answersLabel")}</span>
          <span class="note-hint" data-hint="${h(t("hintAnswers"))}">?</span>
        </div>
        <div id="noteAnswersList" class="note-answers-list"></div>
        <button type="button" class="note-add-btn" id="noteAddAnswerBtn">${t("addAnswerBtn")}</button>
      </div>`;
  }
  if (type === "story") {
    return `
      <div class="note-field">
        <div class="note-field-label">
          <span>${t("storyTitleField")}</span>
          <span class="note-hint" data-hint="${h(t("hintStoryTitle"))}">?</span>
        </div>
        <input name="title" class="note-field-input" value="${h(data?.title)}" required placeholder="${h(t("phStoryTitle"))}" />
      </div>
      <div class="note-field">
        <div class="note-field-label">
          <span>${t("tags")}</span>
          <span class="note-hint" data-hint="${h(t("hintTags"))}">?</span>
        </div>
        <input name="tags" class="note-field-input" value="${h(tagStr(data?.tags))}" placeholder="${h(t("phStoryTags"))}" />
      </div>
      <div class="note-field-section-label">STAR</div>
      <div class="note-field">
        <div class="note-field-label">
          <span>S — ${t("storySituationLabel")}</span>
          <span class="note-hint" data-hint="${h(t("hintSituation"))}">?</span>
        </div>
        <textarea name="situation" class="note-field-input" rows="4" placeholder="${h(t("phStorySituation"))}">${h(data?.situation)}</textarea>
      </div>
      <div class="note-field">
        <div class="note-field-label">
          <span>T — ${t("storyTaskLabel")}</span>
          <span class="note-hint" data-hint="${h(t("hintTask"))}">?</span>
        </div>
        <textarea name="task" class="note-field-input" rows="4" placeholder="${h(t("phStoryTask"))}">${h(data?.task)}</textarea>
      </div>
      <div class="note-field">
        <div class="note-field-label">
          <span>A — ${t("storyActionLabel")}</span>
          <span class="note-hint" data-hint="${h(t("hintAction"))}">?</span>
        </div>
        <textarea name="action" class="note-field-input" rows="5" placeholder="${h(t("phStoryAction"))}">${h(data?.action)}</textarea>
      </div>
      <div class="note-field">
        <div class="note-field-label">
          <span>R — ${t("storyResultLabel")}</span>
          <span class="note-hint" data-hint="${h(t("hintResult"))}">?</span>
        </div>
        <textarea name="result" class="note-field-input" rows="4" placeholder="${h(t("phStoryResult"))}">${h(data?.result)}</textarea>
      </div>
      <div class="note-field">
        <div class="note-field-label">
          <span>${t("storyNotesLabel")}</span>
          <span class="note-hint" data-hint="${h(t("hintStoryNotes"))}">?</span>
        </div>
        <textarea name="notes" class="note-field-input" rows="3" placeholder="${h(t("phStoryNotes"))}">${h(data?.notes)}</textarea>
      </div>`;
  }
  if (type === "company") {
    return `
      <div class="note-field">
        <div class="note-field-label">
          <span>${t("company")}</span>
          <span class="note-hint" data-hint="${h(t("hintCompanyName"))}">?</span>
        </div>
        <input name="company_name" class="note-field-input" value="${h(data?.company_name)}" required />
      </div>
      <div class="note-field">
        <div class="note-field-label">
          <span>${t("industryLabel")}</span>
          <span class="note-hint" data-hint="${h(t("hintIndustry"))}">?</span>
        </div>
        <input name="industry" class="note-field-input" value="${h(data?.industry)}" placeholder="${h(t("phCompanyIndustry"))}" />
      </div>
      <div class="note-field">
        <div class="note-field-label">
          <span>${t("tags")}</span>
          <span class="note-hint" data-hint="${h(t("hintTags"))}">?</span>
        </div>
        <input name="tags" class="note-field-input" value="${h(tagStr(data?.tags))}" placeholder="${h(t("phCompanyTags"))}" />
      </div>
      <div class="note-field">
        <div class="note-field-label">
          <span>${t("overviewLabel")}</span>
          <span class="note-hint" data-hint="${h(t("hintOverview"))}">?</span>
        </div>
        <textarea name="overview" class="note-field-input" rows="4" placeholder="${h(t("phCompanyOverview"))}">${h(data?.overview)}</textarea>
      </div>
      <div class="note-field">
        <div class="note-field-label">
          <span>${t("cultureLabel")}</span>
          <span class="note-hint" data-hint="${h(t("hintCulture"))}">?</span>
        </div>
        <textarea name="culture" class="note-field-input" rows="4" placeholder="${h(t("phCompanyCulture"))}">${h(data?.culture)}</textarea>
      </div>
      <div class="note-field">
        <div class="note-field-label">
          <span>${t("whyInterestedLabel")}</span>
          <span class="note-hint" data-hint="${h(t("hintWhyInterested"))}">?</span>
        </div>
        <textarea name="why_interested" class="note-field-input" rows="4" placeholder="${h(t("phCompanyWhy"))}">${h(data?.why_interested)}</textarea>
      </div>
      <div class="note-field">
        <div class="note-field-label">
          <span>${t("interviewFocusLabel")}</span>
          <span class="note-hint" data-hint="${h(t("hintInterviewFocus"))}">?</span>
        </div>
        <textarea name="interview_focus" class="note-field-input" rows="4" placeholder="${h(t("phCompanyFocus"))}">${h(data?.interview_focus)}</textarea>
      </div>
      <div class="note-field">
        <div class="note-field-label">
          <span>${t("otherNotesLabel")}</span>
        </div>
        <textarea name="notes" class="note-field-input" rows="4">${h(data?.notes)}</textarea>
      </div>`;
  }
  return "";
}

function renderNoteEditor() {
  const { type, id, data } = activeEditor;
  moduleView.innerHTML = `
    <div class="note-editor">
      <div class="note-editor-nav">
        <button type="button" class="note-back-btn" id="noteBackBtn">${t("back")}</button>
      </div>
      <form id="noteEditorForm" class="note-editor-form">
        ${getNoteEditorFields(type, data)}
        <div class="note-editor-footer">
          <button type="button" class="note-back-btn" id="noteBackBtn2">${t("cancel")}</button>
          <button type="submit" class="primary">${t("save")}</button>
        </div>
      </form>
    </div>`;

  if (type === "question") {
    const container = document.querySelector("#noteAnswersList");
    const answers = data?.answers || [];
    if (answers.length) {
      answers.forEach((ans) => addAnswerRow(container, typeof ans === "object" ? (ans.label || "") : "", typeof ans === "object" ? (ans.content || "") : String(ans)));
    } else {
      addAnswerRow(container);
    }
    document.querySelector("#noteAddAnswerBtn").addEventListener("click", () => addAnswerRow(container));
  }

  const backHandler = () => {
    activeEditor = null;
    if (activeView === "PREPARE") {
      renderPrepareView();
      return;
    }
    renderViewShell();
    if (activeView === "QUESTION_BANK") renderQuestionBankContent();
    else if (activeView === "INTERVIEW_STORIES") renderInterviewStoriesContent();
    else if (activeView === "COMPANY_NOTES") renderCompanyNotesContent();
  };
  document.querySelector("#noteBackBtn")?.addEventListener("click", backHandler);
  document.querySelector("#noteBackBtn2")?.addEventListener("click", backHandler);

  function autoResize(el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; }
  moduleView.querySelectorAll("textarea.note-field-input").forEach((ta) => {
    autoResize(ta);
    ta.addEventListener("input", () => autoResize(ta));
  });

  document.querySelector("#noteEditorForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveNoteEditor(event.target);
  });
}

async function saveNoteEditor(form) {
  const { type, id } = activeEditor;
  const fd = new FormData(form);
  let payload, url, method;

  if (type === "question") {
    const container = document.querySelector("#noteAnswersList");
    const answers = [];
    container?.querySelectorAll(".answer-row").forEach((row) => {
      const label = (row.querySelector(".answer-label-input")?.value || "").trim();
      const content = (row.querySelector(".answer-content-input")?.value || "").trim();
      if (content) answers.push({ label, content });
    });
    payload = { question: fd.get("question"), category: fd.get("category") || "general", tags: fd.get("tags") || "", answers };
    url = id ? `/api/question-bank/${id}` : "/api/question-bank";
    method = id ? "PATCH" : "POST";
  } else if (type === "story") {
    payload = { title: fd.get("title"), tags: fd.get("tags") || "", situation: fd.get("situation") || "", task: fd.get("task") || "", action: fd.get("action") || "", result: fd.get("result") || "", notes: fd.get("notes") || "" };
    url = id ? `/api/interview-stories/${id}` : "/api/interview-stories";
    method = id ? "PATCH" : "POST";
  } else {
    payload = { company_name: fd.get("company_name"), industry: fd.get("industry") || "", tags: fd.get("tags") || "", overview: fd.get("overview") || "", culture: fd.get("culture") || "", why_interested: fd.get("why_interested") || "", interview_focus: fd.get("interview_focus") || "", notes: fd.get("notes") || "" };
    url = id ? `/api/company-notes/${id}` : "/api/company-notes";
    method = id ? "PATCH" : "POST";
  }

  await api(url, { method, body: JSON.stringify(payload) });
  activeEditor = null;
  await loadJobs();
}

function renderModuleView() {
  const module = moduleText(activeView);
  if (!module) return;
  summary.textContent = module.summary;

  const isAI = activeView === "AI_ASSISTANT";
  const aiNote = isAI
    ? `<p class="coming-soon-note">需要用户自己的 API Token（Claude / OpenAI）。Token 仅保存在本地，不会上传。</p>`
    : "";

  moduleView.innerHTML = `
    <div class="coming-soon-shell">
      <div class="coming-soon-badge">Coming Soon</div>
      <h2 class="coming-soon-title">${escapeHtml(module.title)}</h2>
      <p class="coming-soon-desc">${escapeHtml(module.summary)}</p>
      ${aiNote}
      <div class="coming-soon-cards">
        ${module.cards.map(([title, body]) => `
          <div class="coming-soon-card">
            <strong>${escapeHtml(title)}</strong>
            <span>${escapeHtml(body)}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderProfiles() {
  summary.textContent = `${resumeProfiles.length} ${t("resumeProfiles")}`;
  profilesEmpty.style.display = resumeProfiles.length ? "none" : "block";
  profilesGrid.innerHTML = resumeProfiles.map((profile) => {
    const fields = mergedAutofillFields(profile);
    const tags = Array.isArray(profile.tags) ? profile.tags : [];
    return `
      <article class="profile-card">
        <div>
          <h3>${escapeHtml(profile.name)}</h3>
          <p class="muted">${escapeHtml(profile.file_name)} · ${escapeHtml(String(profile.file_type || "").toUpperCase())}</p>
        </div>
        <div class="tag-row">
          ${tags.length ? tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("") : `<span>${t("noTags")}</span>`}
        </div>
        <dl class="profile-fields">
          <div><dt>${t("fullName")}</dt><dd>${escapeHtml(fields.full_name || "-")}</dd></div>
          <div><dt>${t("email")}</dt><dd>${escapeHtml(fields.email || "-")}</dd></div>
          <div><dt>${t("phone")}</dt><dd>${escapeHtml(fields.phone || "-")}</dd></div>
          <div><dt>${t("location")}</dt><dd>${escapeHtml(fields.location || "-")}</dd></div>
        </dl>
        <div class="profile-actions">
          <a href="/api/resume-profiles/${profile.id}/file" target="_blank" rel="noreferrer">${t("openFile")}</a>
          <button data-profile-action="detail" data-id="${profile.id}">${t("detail")}</button>
          <button data-profile-action="edit" data-id="${profile.id}">${t("edit")}</button>
          <button class="danger-button" data-profile-action="delete" data-id="${profile.id}">${t("delete")}</button>
        </div>
      </article>
    `;
  }).join("");

  profilesGrid.querySelectorAll("[data-profile-action='edit']").forEach((button) => {
    button.addEventListener("click", () => {
      const profile = resumeProfiles.find((item) => String(item.id) === button.dataset.id);
      if (profile) openProfileEditDialog(profile);
    });
  });

  profilesGrid.querySelectorAll("[data-profile-action='detail']").forEach((button) => {
    button.addEventListener("click", () => {
      const profile = resumeProfiles.find((item) => String(item.id) === button.dataset.id);
      if (profile) openProfileDetailDialog(profile);
    });
  });

  profilesGrid.querySelectorAll("[data-profile-action='delete']").forEach((button) => {
    button.addEventListener("click", async () => {
      const profile = resumeProfiles.find((item) => String(item.id) === button.dataset.id);
      if (!profile) return;
      const ok = window.confirm(t("deleteProfileConfirm", { name: profile.name }));
      if (!ok) return;
      await api(`/api/resume-profiles/${profile.id}`, { method: "DELETE" });
      await loadProfiles();
    });
  });
}

async function loadProfiles() {
  const [profiles, personal] = await Promise.all([
    api("/api/resume-profiles"),
    api("/api/user-profile"),
  ]);
  resumeProfiles = profiles;
  userProfile = personal;
  renderProfiles();
}

async function loadJobs() {
  const params = new URLSearchParams();
  if (activeView === "APPLICATIONS" && searchInput.value.trim()) params.set("q", searchInput.value.trim());
  allJobs = await api(`/api/jobs?${params.toString()}`);
  jobs = allJobs;
  renderStatusControls();
  renderApplicationTableHead();
  renderViewShell();
  if (activeView === "DASHBOARD") {
    userProfile = await api("/api/user-profile");
    await renderDashboardView();
  } else if (activeView === "SUMMARY") {
    renderSummaryView();
  } else if (activeView === "PREPARE") {
    await renderPrepareView();
  } else if (activeView === "PROFILES") {
    await loadProfiles();
  } else if (MODULE_VIEWS[activeView]) {
    if (activeEditor !== null) {
      renderNoteEditor();
    } else if (activeView === "WEEKLY_REVIEW") {
      userProfile = await api("/api/user-profile");
      await renderWeeklyReviewView();
    } else if (activeView === "QUESTION_BANK") {
      renderQuestionBankContent();
      await renderQuestionBankView();
    } else if (activeView === "INTERVIEW_STORIES") {
      renderInterviewStoriesContent();
      await renderInterviewStoriesView();
    } else if (activeView === "COMPANY_NOTES") {
      renderCompanyNotesContent();
      await renderCompanyNotesView();
    } else {
      renderModuleView();
    }
  } else {
    renderJobs();
  }
}

function openProfileEditDialog(profile) {
  profileEditId.value = profile.id;
  profileEditName.value = profile.name || "";
  profileEditTags.value = Array.isArray(profile.tags) ? profile.tags.join(", ") : "";
  profileEditEmail.value = fieldValue(profile, "email");
  profileEditLinkedin.value = fieldValue(profile, "linkedin");
  profileEditGithub.value = fieldValue(profile, "github");
  profileEditPortfolio.value = fieldValue(profile, "portfolio");
  profileEditDialog.showModal();
}

function openProfileDetailDialog(profile) {
  profileDetailTitle.textContent = profile.name;
  profileDetailFile.href = `/api/resume-profiles/${profile.id}/file`;
  profileDetailFile.textContent = t("openOriginalResume");
  profileDetailText.textContent = profile.extracted_text || t("noResumeText");
  profileDetailDialog.showModal();
}

function openPersonalInfoDialog() {
  for (const element of personalInfoForm.elements) {
    if (!element.name) continue;
    element.value = userProfile[element.name] || "";
  }
  personalInfoDialog.showModal();
}

function openEditDialogForJob(job) {
  editJobId.value = job.id;
  editCompanyName.value = job.company_name || "";
  editPositionName.value = job.position_name || "";
  editDepartmentName.value = job.department_name || "";
  editOfficeLocation.value = job.office_location || "";
  editSourceUrl.value = job.source_url || "";
  editApplyUrl.value = job.apply_url || "";
  editApplyTime.value = dateInputValue(job.apply_time || job.created_at);
  editSalaryRange.value = job.salary_range || "";
  editRequirements.value = job.requirements || "";
  editNotes.value = job.notes || "";
  renderTrackingSelects("edit", job);
  renderJobTypeSelect(editJobTypeSelect, job.job_type || "FULL_TIME");
  editNextActionSelect.innerHTML = nextActionOptions(job.next_action || "DECIDE");
  renderStageSelect(editStageSelect, job.current_stage || "APPLIED");
  renderSubStatusSelect(editSubStatusSelect, job.current_stage || "APPLIED", job.status);
  syncApplicationFieldsForStage(job.current_stage || "APPLIED", editApplyTime, editSubStatusSelect);
  editCustomSubStatusField.hidden = true;
  editCustomSubStatusInput.required = false;
  editCustomSubStatusInput.value = "";
  editDialog.showModal();
}

async function renderTimelineDialog(job) {
  const timeline = await api(`/api/jobs/${job.id}/timeline`);
  timelineDialogTitle.textContent = job.position_name;
  timelineDialogMeta.textContent = `${job.company_name} · ${stageLabelForJob(job)} · ${statusLabel(job.status)}`;
  timelineList.innerHTML = timeline.length ? timeline.map((item) => `
    <div class="timeline-item">
      <p><strong>${escapeHtml(item.event_title)}</strong></p>
      <p class="muted">${formatDate(item.event_time)} · ${escapeHtml(item.source)}</p>
      ${item.notes ? `<p>${escapeHtml(item.notes)}</p>` : ""}
    </div>
  `).join("") : `<p class="muted">${t("noTimeline")}</p>`;
}

function detailValue(value, isOption = false) {
  if (isOption) return optionLabel(value || "");
  return value ? escapeHtml(value) : "-";
}

async function renderJobDetailDialog(job) {
  const timeline = await api(`/api/jobs/${job.id}/timeline`);
  jobDetailTitle.textContent = job.position_name;
  jobDetailMeta.textContent = `${job.company_name} · ${stageLabelForJob(job)} · ${nextActionLabel(job.next_action)}`;
  jobDetailContent.innerHTML = `
    <section class="job-detail-panel">
      <h4>${t("stage")}</h4>
      <p>${stageLabelForJob(job)} · ${statusLabel(job.status)}</p>
      <h4>${t("nextAction")}</h4>
      <select class="inline-status" id="jobDetailNextAction">
        ${nextActionOptions(job.next_action || "DECIDE")}
      </select>
      <h4>${t("tableUpdated")}</h4>
      <p>${formatDate(job.updated_at || job.created_at)}</p>
    </section>
    <section class="job-detail-panel">
      <h4>${t("companyCategory")}</h4>
      <p>${detailValue(job.company_category, true)}</p>
      <h4>${t("department")}</h4>
      <p>${detailValue(job.department_name)}</p>
      <h4>${t("officeLocation")}</h4>
      <p>${detailValue(job.office_location)}</p>
      <h4>${t("commuteRequirement")}</h4>
      <p>${detailValue(job.commute_requirement, true)}</p>
    </section>
    <section class="job-detail-panel">
      <h4>${t("visaSponsorship")}</h4>
      <p>${detailValue(job.visa_sponsorship, true)}</p>
      <h4>${t("salaryRange")}</h4>
      <p>${detailValue(job.salary_range)}</p>
      <h4>${t("rotationPreference")}</h4>
      <p>${detailValue(job.rotation_preference, true)}</p>
      <h4>${t("applicationLimit")}</h4>
      <p>${detailValue(job.application_limit, true)}</p>
      <h4>${t("duplicateCheck")}</h4>
      <p>${detailValue(job.duplicate_check, true)}</p>
      <h4>${t("interviewProcess")}</h4>
      <p>${detailValue(job.interview_process, true)}</p>
    </section>
    <section class="job-detail-panel">
      <h4>${t("requirements")}</h4>
      <p>${detailValue(job.requirements)}</p>
      <h4>${t("notes")}</h4>
      <p>${detailValue(job.notes)}</p>
    </section>
    <section class="job-detail-panel">
      <h4>${t("timeline")}</h4>
      ${timeline.length ? timeline.slice(0, 4).map((item) => `
        <div class="timeline-item">
          <p><strong>${escapeHtml(item.event_title)}</strong></p>
          <p class="muted">${formatDate(item.event_time)}</p>
        </div>
      `).join("") : `<p class="muted">${t("noTimeline")}</p>`}
    </section>
    <section class="job-detail-actions">
      <button type="button" data-detail-action="timeline">${t("timeline")}</button>
      <button type="button" data-detail-action="jd">${t("openJdTitle")}</button>
      ${["SAVED", "ARCHIVED"].includes(job.current_stage) ? "" : `<button type="button" class="prep-action-btn" data-detail-action="prep">${t("prepBtn")}</button>`}
      <button type="button" data-detail-action="edit">${t("edit")}</button>
      <button type="button" class="danger-button" data-detail-action="delete">${t("delete")}</button>
    </section>
  `;
  jobDetailContent.querySelector("[data-detail-action='timeline']")?.addEventListener("click", async () => {
    jobDetailDialog.close();
    timelineJob = job;
    await renderTimelineDialog(job);
    timelineDialog.showModal();
  });
  jobDetailContent.querySelector("#jobDetailNextAction")?.addEventListener("change", async (event) => {
    const updated = await patchJobFromInline(job, { next_action: event.target.value });
    await renderJobDetailDialog(updated);
  });
  jobDetailContent.querySelector("[data-detail-action='jd']")?.addEventListener("click", () => {
    jobDetailDialog.close();
    openJdDialogForJob(job);
  });
  jobDetailContent.querySelector("[data-detail-action='prep']")?.addEventListener("click", async () => {
    jobDetailDialog.close();
    await openPrepDialog(job);
  });
  jobDetailContent.querySelector("[data-detail-action='edit']")?.addEventListener("click", () => {
    jobDetailDialog.close();
    openEditDialogForJob(job);
  });
  jobDetailContent.querySelector("[data-detail-action='delete']")?.addEventListener("click", async () => {
    const ok = window.confirm(t("deleteJobConfirm", { job: `${job.company_name} - ${job.position_name}` }));
    if (!ok) return;
    await api(`/api/jobs/${job.id}`, { method: "DELETE" });
    jobDetailDialog.close();
    await loadJobs();
  });
  jobDetailDialog.showModal();
}

function openJdDialogForJob(job) {
  jdDialogTitle.textContent = `${job.company_name} - ${job.position_name}`;
  openSavedJd.href = `/api/jobs/${job.id}/jd`;
  openSavedHtml.href = `/api/jobs/${job.id}/html`;

  if (job.source_url) {
    openOriginalJd.href = job.source_url;
    openOriginalJd.removeAttribute("aria-disabled");
    openOriginalJd.classList.remove("disabled");
  } else {
    openOriginalJd.href = "#";
    openOriginalJd.setAttribute("aria-disabled", "true");
    openOriginalJd.classList.add("disabled");
  }

  jdDialog.showModal();
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportCsv() {
  const cols = [
    "id", "company_name", "position_name", "company_category", "department_name",
    "office_location", "commute_requirement", "job_type", "current_stage", "status",
    "next_action", "deadline", "apply_time", "source_url", "apply_url", "requirements",
    "visa_sponsorship", "salary_range", "rotation_preference", "application_limit",
    "duplicate_check", "interview_process", "notes", "updated_at",
  ];
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const header = cols.join(",");
  const rows = allJobs.map((job) => cols.map((c) => escape(job[c])).join(","));
  downloadFile(`job-tracker-${dateKey(new Date())}.csv`, [header, ...rows].join("\n"), "text/csv");
}

function exportJson() {
  const data = allJobs.map(({
    id, company_name, position_name, company_category, department_name,
    office_location, commute_requirement, job_type, current_stage, status,
    next_action, deadline, apply_time, source_url, apply_url, requirements,
    visa_sponsorship, salary_range, rotation_preference, application_limit,
    duplicate_check, interview_process, notes, updated_at, created_at,
  }) => ({
    id, company_name, position_name, company_category, department_name,
    office_location, commute_requirement, job_type, current_stage, status,
    next_action, deadline, apply_time, source_url, apply_url, requirements,
    visa_sponsorship, salary_range, rotation_preference, application_limit,
    duplicate_check, interview_process, notes, updated_at, created_at,
  }));
  downloadFile(`job-tracker-${dateKey(new Date())}.json`, JSON.stringify(data, null, 2), "application/json");
}

exportCsvBtn.addEventListener("click", () => { exportDropdown.removeAttribute("open"); exportCsv(); });
exportJsonBtn.addEventListener("click", () => { exportDropdown.removeAttribute("open"); exportJson(); });

newJobBtn.addEventListener("click", () => {
  const context = activeView === "PREPARE" ? activePrepareView : activeView;
  if (context === "PROFILES") {
    profileDialog.showModal();
    return;
  }
  if (context === "QUESTION_BANK") {
    openNoteEditor("question");
    return;
  }
  if (context === "INTERVIEW_STORIES") {
    openNoteEditor("story");
    return;
  }
  if (context === "COMPANY_NOTES") {
    openNoteEditor("company");
    return;
  }
  jobDialog.showModal();
});
languageToggle.addEventListener("click", () => {
  currentLang = currentLang === "zh" ? "en" : "zh";
  localStorage.setItem("jobTrackerLanguage", currentLang);
  updateStaticText();
  loadJobs();
});
refreshBtn.addEventListener("click", loadJobs);
dashboardNavButton.addEventListener("click", () => {
  activeView = "DASHBOARD";
  activeEditor = null;
  loadJobs();
});
applicationsNavButton.addEventListener("click", () => {
  activeView = "APPLICATIONS";
  activeEditor = null;
  loadJobs();
});
prepareNavButton.addEventListener("click", () => {
  activeView = "PREPARE";
  activeEditor = null;
  loadJobs();
});
summaryNavButton.addEventListener("click", () => {
  activeView = "SUMMARY";
  activeEditor = null;
  loadJobs();
});
profilesNavButton?.addEventListener("click", () => {
  activeView = "PROFILES";
  activeEditor = null;
  loadJobs();
});
moduleNavButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeView = button.dataset.moduleView;
    activeEditor = null;
    loadJobs();
  });
});

document.querySelector("#sidebarCollapseBtn")?.addEventListener("click", () => {
  const shell = document.querySelector(".app-shell");
  const collapsed = shell.classList.toggle("sidebar-collapsed");
  document.querySelector("#sidebarCollapseBtn").textContent = collapsed ? "›" : "‹";
});
editPersonalInfoBtn.addEventListener("click", openPersonalInfoDialog);
searchInput.addEventListener("input", () => {
  clearTimeout(searchInput.searchTimer);
  searchInput.searchTimer = setTimeout(loadJobs, 180);
});

stageSelect.addEventListener("change", () => {
  renderSubStatusSelect(subStatusSelect, stageSelect.value);
  syncApplicationFieldsForStage(stageSelect.value, jobForm.elements.apply_time, subStatusSelect);
  customSubStatusField.hidden = true;
  customSubStatusInput.required = false;
  customSubStatusInput.value = "";
});

subStatusSelect.addEventListener("change", () => {
  const isCustom = subStatusSelect.value === CUSTOM_STATUS_VALUE;
  customSubStatusField.hidden = !isCustom;
  customSubStatusInput.required = isCustom;
  if (isCustom) customSubStatusInput.focus();
  const resolved = resolvedStageStatus(stageSelect.value, subStatusSelect.value);
  if (resolved.stage !== stageSelect.value || resolved.status !== subStatusSelect.value) {
    stageSelect.value = resolved.stage;
    renderSubStatusSelect(subStatusSelect, resolved.stage, resolved.status);
    syncApplicationFieldsForStage(resolved.stage, jobForm.elements.apply_time, subStatusSelect);
  }
});

editStageSelect.addEventListener("change", () => {
  renderSubStatusSelect(editSubStatusSelect, editStageSelect.value);
  syncApplicationFieldsForStage(editStageSelect.value, editApplyTime, editSubStatusSelect);
  editCustomSubStatusField.hidden = true;
  editCustomSubStatusInput.required = false;
  editCustomSubStatusInput.value = "";
});

editSubStatusSelect.addEventListener("change", () => {
  const isCustom = editSubStatusSelect.value === CUSTOM_STATUS_VALUE;
  editCustomSubStatusField.hidden = !isCustom;
  editCustomSubStatusInput.required = isCustom;
  if (isCustom) editCustomSubStatusInput.focus();
  const resolved = resolvedStageStatus(editStageSelect.value, editSubStatusSelect.value);
  if (resolved.stage !== editStageSelect.value || resolved.status !== editSubStatusSelect.value) {
    editStageSelect.value = resolved.stage;
    renderSubStatusSelect(editSubStatusSelect, resolved.stage, resolved.status);
    syncApplicationFieldsForStage(resolved.stage, editApplyTime, editSubStatusSelect);
  }
});

jobForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitter = event.submitter;
  if (submitter && submitter.value === "cancel") {
    jobDialog.close();
    return;
  }
  const payload = Object.fromEntries(new FormData(jobForm).entries());
  if (payload.status === CUSTOM_STATUS_VALUE) {
    payload.status = (payload.custom_status || "").trim();
  }
  delete payload.custom_status;
  payload.current_stage = payload.current_stage || "SAVED";
  payload.status = payload.status || (SUBSTATUS_BY_STAGE[payload.current_stage] || [])[0] || "SAVED";
  const resolved = resolvedStageStatus(payload.current_stage, payload.status);
  payload.current_stage = resolved.stage;
  payload.status = resolved.status;
  if (["SAVED", "ARCHIVED"].includes(payload.current_stage)) payload.apply_time = "";
  payload.job_type = payload.job_type || "FULL_TIME";
  await api("/api/jobs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  jobForm.reset();
  renderJobTypeSelect(jobTypeSelect, "FULL_TIME");
  renderTrackingSelects();
  nextActionSelect.innerHTML = nextActionOptions("DECIDE");
  renderStageSelect(stageSelect, "SAVED");
  renderSubStatusSelect(subStatusSelect, "SAVED", "SAVED");
  customSubStatusField.hidden = true;
  customSubStatusInput.required = false;
  jobDialog.close();
  await loadJobs();
});

jdDialog.addEventListener("click", (event) => {
  if (event.target.matches("[data-close]")) {
    jdDialog.close();
  }
});

editForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitter = event.submitter;
  if (submitter && submitter.value === "cancel") {
    editDialog.close();
    return;
  }

  const payload = Object.fromEntries(new FormData(editForm).entries());
  const jobId = payload.id;
  delete payload.id;

  if (payload.status === CUSTOM_STATUS_VALUE) {
    payload.status = (payload.custom_status || "").trim();
  }
  delete payload.custom_status;
  payload.current_stage = payload.current_stage || "APPLIED";
  payload.status = payload.status || (SUBSTATUS_BY_STAGE[payload.current_stage] || [])[0] || "APPLIED_SUCCESS";
  const resolved = resolvedStageStatus(payload.current_stage, payload.status);
  payload.current_stage = resolved.stage;
  payload.status = resolved.status;
  if (["SAVED", "ARCHIVED"].includes(payload.current_stage)) payload.apply_time = "";
  payload.job_type = payload.job_type || "FULL_TIME";

  await api(`/api/jobs/${jobId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  editDialog.close();
  await loadJobs();

  if (timelineJob && String(timelineJob.id) === String(jobId)) {
    timelineJob = { ...timelineJob, ...payload };
    await renderTimelineDialog(timelineJob);
  }
});

editDialog.addEventListener("close", () => {
  editCustomSubStatusField.hidden = true;
  editCustomSubStatusInput.required = false;
  editCustomSubStatusInput.value = "";
});

timelineDialog.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-timeline]")) {
    timelineDialog.close();
  }
});

jobDetailDialog.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-job-detail]")) {
    jobDetailDialog.close();
  }
});

prepDialog.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-prep]")) {
    prepJob = null;
    prepDialog.close();
  }
});

prepItemDialog.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-prep-item]")) {
    prepItemDialog.close();
  }
});

timelineForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!timelineJob) return;
  const form = new FormData(event.target);
  await api(`/api/jobs/${timelineJob.id}/timeline`, {
    method: "POST",
    body: JSON.stringify(Object.fromEntries(form.entries())),
  });
  event.target.reset();
  await loadJobs();
  await renderTimelineDialog(timelineJob);
});

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitter = event.submitter;
  if (submitter && submitter.value === "cancel") {
    profileDialog.close();
    return;
  }

  const formData = new FormData(profileForm);
  const file = formData.get("resume_file");
  if (!(file instanceof File) || !file.name) {
    window.alert(t("selectResumeFile"));
    return;
  }
  const payload = Object.fromEntries(formData.entries());
  delete payload.resume_file;
  payload.file_name = file.name;
  payload.file_content_base64 = await fileToBase64(file);

  await api("/api/resume-profiles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  profileForm.reset();
  profileDialog.close();
  await loadProfiles();
});

profileEditForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitter = event.submitter;
  if (submitter && submitter.value === "cancel") {
    profileEditDialog.close();
    return;
  }

  const payload = Object.fromEntries(new FormData(profileEditForm).entries());
  const profileId = payload.id;
  delete payload.id;
  await api(`/api/resume-profiles/${profileId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  profileEditDialog.close();
  await loadProfiles();
});

personalInfoForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitter = event.submitter;
  if (submitter && submitter.value === "cancel") {
    personalInfoDialog.close();
    return;
  }
  const payload = Object.fromEntries(new FormData(personalInfoForm).entries());
  await api("/api/user-profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  personalInfoDialog.close();
  await loadProfiles();
});

profileDetailDialog.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-profile-detail]")) {
    profileDetailDialog.close();
  }
});

document.querySelectorAll('button[value="cancel"]').forEach((btn) => {
  btn.formNoValidate = true;
});

document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

updateStaticText();
renderStatusControls();
loadJobs().catch((error) => {
  summary.textContent = error.message;
});
