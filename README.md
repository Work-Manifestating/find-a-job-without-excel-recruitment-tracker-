# Job Application Tracker

A job-hunting tool for everyone.

Are you tired of jumping between job boards, spreadsheets, notes, and browser tabs just to copy and paste the same job information again and again? Do tiny Excel cells make your eyes blur after a long day of applications? Did you lose access to your student account after graduation and suddenly lose the tools you relied on? Have you ever received an interview invitation, tried to reopen the original job description, and discovered that the page had disappeared, leaving you pretending you still remember exactly what role and company you applied for?

This tracker is built to make those problems disappear.

With a small browser extension, you can save job information with one click and cut down the meaningless admin time that eats into the application process. Instead of spending energy copying links, job descriptions, company names, and notes into scattered files, you can focus on the parts that actually matter: understanding the role, preparing your answers, improving your materials, and following up with confidence.

The tracker uses multiple backup methods so that, even if the original job posting is removed or the website becomes unavailable, you can still access the first version of the job description you saved. It stores the original URL, page title, selected JD text, Markdown backup, and HTML backup locally.

Privacy is a core principle of this project. Your personal information is not uploaded anywhere. The web app and browser extension communicate through a local port on your own machine, and your job data is managed locally. Your applications, notes, resumes, reflections, and saved job descriptions stay with you.

The tool is also designed for reflection, not just storage. Job hunting can feel confusing: you apply, wait, forget what happened, and lose track of whether your effort is turning into progress. This tracker includes review and analysis features, including a classic Sankey Diagram for funnel conversion and a GitHub-style application heatmap that shows your daily application activity. Together, they help you understand both your effort and your outcomes.

## What It Helps With

- Save job descriptions from the browser with one click.
- Keep job information, application status, deadlines, notes, and timelines in one local dashboard.
- Preserve job descriptions even after the original posting disappears.
- Track stages such as saved, applied, assessment, interview, offer, rejection, and archive.
- Review your application funnel with a Sankey Diagram.
- Review your daily effort with a GitHub-style heatmap.
- Keep weekly reflections and daily review notes.
- Prepare reusable application answers, interview stories, company notes, and resume profiles.
- Keep your private job search data local.

## How To Use This Tool

### 1. Start The Local Web App

From the project folder, run:

```bash
python3 server.py
```

Then open:

```text
http://127.0.0.1:8765
```

This opens the local dashboard where you can manage your job search.

### 2. Install The Chrome Extension

1. Open `chrome://extensions/`.
2. Turn on `Developer mode`.
3. Click `Load unpacked`.
4. Select the `extension/` folder in this project.

After installation, the extension can save job pages into your local tracker.

### 3. Save A Job Posting

1. Open a job description page in Chrome.
2. Select the main job description text if possible.
3. Click the `Job Tracker Capture` extension button.
4. Check or edit the company name and role name.
5. Save the job.

The tracker will save the job URL, page title, selected JD text, full HTML backup, and job metadata to your local dashboard.

### 4. Manage Your Applications

Use the `Applications` page to update each job's stage, sub-status, next action, deadline, and timeline. You can track whether a role is still saved, already applied, in assessment, in interview, rejected, offered, or archived.

### 5. Prepare For Applications And Interviews

Use the preparation modules to organize reusable material:

- Application question answers.
- STAR interview stories.
- Company research notes.
- Resume profiles for different role types.

### 6. Review Your Progress

Use `Funnel Analysis` to see your application conversion through a Sankey Diagram.

Use `Weekly Review` to see your application heatmap, identify patterns, and write reflections about what happened this week and what to focus on next.

### 7. Keep Your Data Local

Runtime data is stored in the local `data/` folder, including the SQLite database, saved job descriptions, resume files, and local logs. The `data/` folder is ignored by Git, so your real job search data is not committed to the repository.

---

# Job Application Tracker

一个本地优先的求职流程管理工具，用来替代散乱的 Excel、Notion 表格和浏览器收藏夹。

项目目前由三部分组成：

- **Local Web App**：浏览器里的 Main Dashboard 和详细模块页面。
- **Local API + SQLite**：`server.py` 提供本地 API，数据写入本机 SQLite。
- **Chrome Extension**：从招聘网页抓取 JD、链接和页面内容，一键保存到本地 tracker。

核心原则：代码可以推到 GitHub，个人求职数据留在本地。

## 功能模块

### Track

- 保存和管理岗位。
- 记录公司、岗位、链接、JD、投递时间、阶段、状态和下一步动作。
- 支持阶段流转、状态更新、Timeline、搜索、删除确认。
- Dashboard 汇总整体投递进度和近期需要处理的事项。

### Prepare

- **Application Question Bank**：沉淀常见申请问题和可复用答案。
- **Interview Story Library**：用 STAR 结构管理面试故事。
- **Company Research Notes**：保存公司研究、行业、文化、动机和面试重点。
- **Resume Profiles**：为不同方向保存不同简历版本和自动填表字段。

### Review

- **Weekly Review**：保存每周复盘内容。
- **Calendar Review**：在 Main Dashboard 里按日期查看当天操作、Timeline 和复盘。
- **Funnel Analysis**：查看投递流程中的阶段分布和卡点。

### Automation

- Chrome 插件保存当前招聘页面。
- 插件读取当前 URL、页面标题、完整 HTML 和选中的 JD 文本。
- 插件可打开 Main Dashboard。
- 可选 Native Messaging helper：让插件在本地服务未启动时尝试启动 `server.py`。
- 自动化模块保留 Email Sync、AI Assistant、Cover Letters、Auto Apply 的入口，用于后续扩展。

## 安装

推荐先创建虚拟环境：

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

当前 Python 依赖主要用于更可靠地解析简历 PDF：

- `pdfplumber`：优先解析 PDF 文本，保留较好的版面和换行信息。
- `pypdf`：PDF 文本解析备用方案。

如果没有安装依赖，系统会回退到标准库解析方式，但复杂 PDF 的解析质量会比较有限。

## 启动网站

在项目根目录运行：

```bash
python3 server.py
```

然后打开：

```text
http://127.0.0.1:8765
```

如果浏览器显示 `127.0.0.1 refused to connect`，通常表示本地服务没有启动，重新运行 `python3 server.py` 即可。

## 安装 Chrome 插件

先确认本地服务已经启动，然后：

1. 打开 `chrome://extensions/`
2. 打开右上角 `Developer mode`
3. 点击 `Load unpacked`
4. 选择本项目里的 `extension/` 文件夹

使用方式：

1. 打开一个招聘 JD 页面。
2. 推荐先选中页面里的 JD 正文。
3. 点击 Chrome 工具栏里的 `Job Tracker Capture`。
4. 确认公司名和岗位名。
5. 点击保存。

插件会把当前页面 URL、页面标题、完整 HTML、JD 文本发送到本地服务，并写入 Dashboard。

## 插件一键启动服务

普通浏览器扩展出于安全限制，不能直接执行本机 Python 命令。所以插件想要“一键启动 `server.py`”，必须额外安装 Native Messaging helper。

安装方式：

```bash
python3 native_host/install_native_host.py <你的 Chrome 扩展 ID>
```

扩展 ID 可以在 `chrome://extensions` 中打开 Developer mode 后看到。安装完成后，重新加载插件。

安装 helper 后，如果插件检测到本地服务离线，会显示：

- `尝试启动`：通过 Native Messaging helper 启动 `server.py`。
- `复制命令`：复制 `python3 server.py`，方便手动运行。
- `重新检测`：重新检查 `http://127.0.0.1:8765`。

helper 日志写入：

```text
data/native_host.log
```

## 本地数据和隐私

运行时数据都在：

```text
data/
```

常见内容包括：

- `data/tracker.db`：SQLite 数据库。
- `data/jobs/`：保存的 JD Markdown 和 HTML 备份。
- `data/resumes/`：上传或生成的简历文件。
- `data/native_host.log`：Native Messaging helper 日志。

`data/` 已经在 `.gitignore` 中，不会提交到 GitHub。真实求职数据、个人简历、复盘内容都只保存在本机。
