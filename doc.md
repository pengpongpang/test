# Potpie

### 节点 (NODE)

从代码中可以看到，主要存在以下几种节点类型：

1. FUNCTION : 函数节点

   - 在 `get_code_graph_from_node_name_tool.py` 中可以看到函数节点的定义和查询

2. CLASS : 类节点

   - 从代码中的节点类型判断逻辑可以看出，区分了 class 和 function 两种主要类型

3. FILE : 文件节点

   - 在代码中有对文件级别节点的处理

#### 节点类型识别

从代码中可以看到，主要通过以下方式识别节点类型：

1. 使用 tree-sitter 解析器进行代码解析

   ```python
   parser = get_parser(language.name)
   tree = parser.parse(bytes(file_content, "utf8"))
   root_node = tree.root_node
    ```

2. 通过语法树节点类型判断

   ```python
   if tag.type == "class":
       node_type = "class"
   elif tag.type == "function":
       node_type = "function"
    ```

#### 节点属性

每个节点都包含以下属性：

1. node_id : 节点唯一标识符
2. name : 节点名称
3. file_path : 文件路径
4. start_line : 开始行号
5. end_line : 结束行号
6. text : 节点的代码内容
7. docstring : 文档字符串
8. repoId : 所属仓库ID
9. tags : 节点标签数组

### 关系类型 (Relationships)

从 `get_code_graph_from_node_name_tool.py` 中的 Neo4j 查询可以看到以下关系类型：

1. CONTAINS : 包含关系
    - 起始节点：FILE 节点或 CLASS 节点
    - 终止节点：CLASS 节点或 FUNCTION 节点
    - 作用：表示代码结构的层次关系
    - FILE -> CLASS：文件包含类定义
    - FILE -> FUNCTION：文件包含函数定义
    - CLASS -> FUNCTION：类包含成员函数

2. CALLS : 函数调用关系
    - 起始节点：FUNCTION 节点
    - 终止节点：FUNCTION 节点
    - 作用：表示函数之间的调用关系

3. FUNCTION_DEFINITION : 函数定义关系
    - 起始节点：FILE 节点
    - 终止节点：FUNCTION 节点
    - 作用：表示一个文件中定义了某个函数

4. IMPORTS : 导入关系
    - 起始节点：FILE 节点
    - 终止节点：FILE 节点
    - 作用：表示文件之间的导入依赖关系

5. INSTANTIATES : 实例化关系
    - 起始节点：FUNCTION 节点
    - 终止节点：CLASS 节点
    - 作用：表示在某个函数中实例化了某个类

6. CLASS_DEFINITION : 类定义关系
    - 起始节点：FILE 节点
    - 终止节点：CLASS 节点
    - 作用：表示一个文件中定义了某个类

7. IS_LEAF : 叶子节点关系（用于标记终端节点）
    - 起始节点：任意节点类型
    - 终止节点：任意节点类型
    - 作用：用于标记知识图谱中的终端节点，表示该节点没有进一步的关系延伸

#### 关系识别

关系识别主要通过以下方式：

1. 文件级关系（CONTAINS, IMPORTS）

   - 通过解析 import 语句识别文件间的导入关系
   - 通过语法树的父子节点关系识别文件对类和函数的包含关系

2. 函数级关系（CALLS, INSTANTIATES）

   - 通过分析函数体中的函数调用表达式识别 CALLS 关系
   - 通过分析函数体中的类实例化语句识别 INSTANTIATES 关系

3. 定义关系（FUNCTION_DEFINITION, CLASS_DEFINITION）

   - 通过语法树节点的位置信息（start_line, end_line）确定定义关系

### 标签系统 (Tags)

从 `get_nodes_from_tags_tool.py` 中可以看到系统支持的标签类型：

后端标签：

- API

  - 定义：标记API端点定义的代码
  - 应用：用于标记路由处理器、控制器、API处理函数等
  - 示例：FastAPI的路由处理函数、REST API端点定义

- AUTH

  - 定义：标记与认证和授权相关的代码
  - 应用：用于标记权限检查、用户认证、token验证等功能
  - 示例：JWT验证中间件、权限检查装饰器

- DATABASE

  - 定义：标记数据库操作相关代码
  - 应用：用于标记数据库查询、ORM操作、数据模型定义等
  - 示例：SQLAlchemy模型定义、数据库查询函数

- UTILITY

  - 定义：标记通用工具函数
  - 应用：用于标记辅助函数、工具类等
  - 示例：日期处理、字符串操作、格式转换等通用功能

- PRODUCER

  - 定义：标记消息生产者代码
  - 应用：用于标记消息队列的发送端、事件发布者等
  - 示例：Kafka生产者、RabbitMQ消息发布

- CONSUMER

  - 定义：标记消息消费者代码
  - 应用：用于标记消息队列的接收端、事件订阅者等
  - 示例：Kafka消费者、消息处理函数

- EXTERNAL_SERVICE

  - 定义：标记外部服务集成代码
  - 应用：用于标记第三方API调用、外部服务客户端等
  - 示例：HTTP客户端、第三方SDK调用

- CONFIGURATION

  - 定义：标记配置管理相关代码
  - 应用：用于标记配置加载、环境变量处理等
  - 示例：配置类、环境变量加载器

前端标签：

1. UI_COMPONENT

   - 定义：标记UI组件代码
   - 应用：用于标记可重用的界面组件
   - 示例：按钮组件、表单组件、卡片组件

2. FORM_HANDLING

   - 定义：标记表单处理相关代码
   - 应用：用于标记表单验证、提交处理等
   - 示例：表单验证逻辑、表单提交处理器

3. STATE_MANAGEMENT

   - 定义：标记状态管理相关代码
   - 应用：用于标记全局状态、状态更新逻辑等
   - 示例：Redux reducers、Vuex store

4. DATA_BINDING

   - 定义：标记数据绑定相关代码
   - 应用：用于标记视图和数据的同步逻辑
   - 示例：双向绑定实现、响应式数据处理

5. ROUTING

   - 定义：标记路由处理相关代码
   - 应用：用于标记前端路由配置、导航逻辑等
   - 示例：路由配置、路由守卫

6. EVENT_HANDLING

   - 定义：标记事件处理相关代码
   - 应用：用于标记用户交互事件处理
   - 示例：点击事件处理、键盘事件处理

7. STYLING

   - 定义：标记样式相关代码
   - 应用：用于标记CSS样式、主题定义等
   - 示例：样式组件、主题配置

8. MEDIA

   - 定义：标记媒体处理相关代码
   - 应用：用于标记图片、视频等媒体资源处理
   - 示例：图片加载器、视频播放器

9. ANIMATION

   - 定义：标记动画相关代码
   - 应用：用于标记动画效果实现
   - 示例：过渡动画、加载动画

10. ACCESSIBILITY

    - 定义：标记可访问性相关代码
    - 应用：用于标记a11y功能实现
    - 示例：屏幕阅读器支持、键盘导航

11. DATA_FETCHING

    - 定义：标记数据获取相关代码
    - 应用：用于标记API调用、数据加载等
    - 示例：API请求封装、数据预取逻辑

这些标签通过标记不同功能的代码，帮助开发者更好地理解和导航代码库，同时也为代码分析和查询提供了语义层面的支持。

#### 标签识别

标签识别采用多层次的方式：

1. 静态分析

   ```python
   def get_tags_from_code(relative_file_path, file_content):
       tags = []
       # 通过文件路径和内容进行初步判断
       if "api" in relative_file_path.lower():
           tags.append("API")
       if "auth" in relative_file_path.lower():
           tags.append("AUTH")
    ```

2. 语义分析

   - 通过分析函数的 docstring 和代码内容
   - 使用 LLM 进行代码语义理解

   ```python
   def batch_nodes(self, nodes: List[Dict], max_tokens: int = 16000, model: str = "gpt-4"):
       # 使用 LLM 分析代码语义，提取标签
    ```

3. 上下文分析

   - 通过分析节点的关系网络
   - 根据调用关系和依赖关系推断功能属性

## 关系型数据

从 `database.py` 中可以看到项目使用了 SQLAlchemy 作为 ORM，连接到 PostgreSQL 数据库。

主要的数据表和内容包括：

1. 用户相关数据

   - 用户基本信息
   - 认证凭证
   - 用户权限配置
2. 项目相关数据

   - 项目基本信息（ID、名称等）
   - 项目配置
   - 分支信息
   - 仓库元数据
3. 对话相关数据

   - 对话历史记录
   - 消息内容
   - 对话上下文
4. 提示词相关数据

   - 系统提示词模板
   - 用户自定义提示词
5. 使用统计数据

   - API 调用记录
   - 资源使用统计

6. 代码分析数据

    1. 代码节点信息（code_nodes表）

        - id : 节点唯一标识符
        - project_id : 所属项目ID
        - file_path : 文件路径
        - node_type : 节点类型（function/class/file）
        - name : 节点名称
        - content : 节点代码内容
        - start_line : 代码开始行号
        - end_line : 代码结束行号
        - created_at : 创建时间
    2. 节点间关系（code_relations表）

        - id : 关系唯一标识符
        - source_id : 源节点ID（外键关联code_nodes）
        - target_id : 目标节点ID（外键关联code_nodes）
        - relation_type : 关系类型，包括：
            - contains: 包含关系
            - calls: 调用关系
            - imports: 导入关系
            - instantiates: 实例化关系
        - created_at : 创建时间
    3. 代码标签（node_tags表）

        - id : 标签唯一标识符
        - node_id : 关联的代码节点ID（外键关联code_nodes）
        - tag_name : 标签名称，如：
            - API
            - AUTH
            - DATABASE
            - UTILITY
            等后端标签和前端标签
        - created_at : 创建时间

    这些表通过外键关联形成完整的代码分析数据网络，而更详细的代码知识图谱则存储在 Neo4j 中。PostgreSQL 主要用于存储基础的结构化数据，便于快速查询和管理。

### 使用 PostgreSQL 查询代码分析数据的场景

1. 项目基本信息查询

    ```python
    def _get_project(self, project_id: str) -> Optional[Project]:
        """Retrieve project from the database."""
        return self.sql_db.query(Project).filter(Project.id == project_id).first()
    ```

    这个查询在 `get_code_graph_from_node_name_tool.py` 中使用，主要用于：

    - 获取项目的基本配置信息
    - 验证项目是否存在
    - 获取项目的仓库和分支信息

2. 代码分析状态追踪

    ```python
    await self.project_service.update_project_status(
        project_id, ProjectStatusEnum.PARSED
    )
    ```

    在 `parsing_service.py` 中使用，用于：

    - 追踪代码解析的进度
    - 记录解析状态变更
    - 触发后续处理流程

3. 代码节点查询

   主要用于以下场景：

    - 获取特定文件的代码节点
    - 查询函数或类的定义
    - 获取代码片段的详细信息

4. 标签关联查询
    使用场景包括：

    - 查找特定标签的代码节点
    - 获取节点的所有标签
    - 基于标签进行代码分类

这种设计使得系统能够高效地管理和查询代码分析的基础数据，同时与 Neo4j 的知识图谱相辅相成，共同支持代码分析功能。

## AI Agent 如何使用代码知识图谱和数据库

1. 工具层级结构

    ```plaintext
    tools/
    ├── code_query_tools/     # 代码查询工具
    ├── kg_based_tools/       # 知识图谱工具
    ├── web_tools/           # 网络工具
    └── change_detection/    # 变更检测工具
    ```

2. 核心工具功能：

    1. 代码查询工具 (code_query_tools)：
        A. `GetCodeFileStructureTool`

        - 作用：获取仓库的文件结构
        - 输入：project_id, 可选的路径
        - 输出：层级化的文件结构字符串

        B. `GetCodeFromNodeNameTool`

        - 作用：通过节点名称获取代码
        - 输入：project_id, node_name (格式如 "src/services/UserService.ts:authenticateUser")
        - 输出：包含代码内容和文件位置的节点详情

        C. `GetCodeGraphFromNodeIdTool`

        - 作用：通过节点ID获取代码关系图
        - 输入：project_id, node_id
        - 输出：展示节点间关系的图结构

    2. 知识图谱工具 (kg_based_tools)：
        A. `KnowledgeGraphQueryTool`

        - 作用：使用自然语言查询代码知识图谱(`inference_service.py` 中维护的向量索引)
        - 输入：queries (问题列表), project_id
        - 特点：支持多个相关问题的批量查询

        B. `GetCodeFromNodeIdTool`

        - 作用：通过节点ID获取代码和文档字符串
        - 输入：project_id, node_id
        - 输出：节点代码、文档和位置信息

        C. `GetNodesFromTags`

        - 作用：通过标签获取相关节点
        - 输入：tags (标签列表), project_id
        - 特点：支持前后端多种标签类型

    3. 工具间协作：
        A. 层次化查询：
        - 先使用 GetCodeFileStructureTool 获取整体结构
        - 再用 GetCodeFromNodeNameTool 获取具体代码
        - 最后用 GetCodeGraphFromNodeIdTool 分析代码关系

        B. 知识图谱集成：

        ```python
        # 获取节点代码
        code_info = await get_code_from_node_id_tool.arun(project_id, node_id)

        # 获取相关节点
        neighbours = await get_node_neighbours_from_node_id_tool.arun(project_id, [node_id])

        # 查询知识图谱
        context = await ask_knowledge_graph_queries_tool.arun(queries, project_id)
        ```

3. Agent 系统：

    A. 基础 Agent：

    - `RAGAgent` : 基础检索增强生成 Agent
    - `DebugRAGAgent` : 调试专用 Agent

    B. 专用 Agent：

    - `BlastRadiusAgent` : 分析代码变更影响范围
    - `IntegrationTestAgent` : 集成测试生成
    - `UnitTestAgent` : 单元测试生成

4. 工作流程：

    1. 数据获取：

        ```python
        # 从知识图谱获取代码信息
        code_info = self.get_code_from_node_id.run(node_id)

        # 获取相关节点
        related_nodes = self.get_node_neighbours_from_node_id.run(node_id)

        # 查询标签相关代码
        tagged_nodes = self.get_nodes_from_tags.run(tags)
        ```

    2. 上下文构建：

        ```python
        # 组合多个来源的代码信息
        context = {
            'code': code_info,
            'related_nodes': related_nodes,
            'tagged_nodes': tagged_nodes
        }
        ```

    3. Agent 处理：

        ```python
        # Agent 使用工具和上下文进行推理
        result = await agent.execute(
            query=user_query,
            context=context,
            tools=[
                self.get_code_from_node_id,
                self.get_nodes_from_tags,
                self.ask_knowledge_graph_queries
            ]
        )
        ```

5. 数据存储：
    A. PostgreSQL：

    - 存储基础的代码节点信息
    - 管理代码关系数据
    - 存储标签系统

    B. Neo4j：

    - 存储完整的代码知识图谱
    - 管理节点间的复杂关系
    - 支持图查询操作

这种架构设计允许 AI Agent：

1. 通过工具访问代码知识
2. 结合多个数据源的信息
3. 进行上下文感知的推理
4. 生成针对性的代码分析和建议

通过这种方式，系统能够提供智能的代码理解和分析服务，同时保持良好的可扩展性和维护性。

## 完整的用例来说明整个过程

假设你问了这样一个问题："解释一下 UserService 中的 authenticateUser 函数是如何工作的？"

1. 对话初始化：

    ```python

    # 1. 创建对话
    POST /conversations/
    {    
        "title": "分析 UserService 认证流程"
    }
    ```

2. 消息处理流程：

    ```python

    # 2. 发送消息
    POST /conversations/{conversation_id}/message/
    {    
        "content": "解释一下 UserService 中的 authenticateUser 函数是如何工作的？"
    }
    ```

3. ConversationController 处理：

    ```python

    class ConversationController:   
        async def post_message(self, conversation_id, message, stream):   
            # 1. 创建用户消息       
            # 2. 初始化 AI Agent        
            # 3. 处理消息并生成响应
    ```

4. Agent 处理流程：

    1. Agent 分类和选择：

        首先通过 `SimplifiedAgentSupervisor` 进行初始化和分类：

        ```python
        classifier_prompt = """
            Given the user query and the current agent ID, select the most appropriate agent by comparing the query's requirements with each agent's specialties.

            Query: {query}
            Current Agent ID: {agent_id}

            Available agents and their specialties:
            {agent_descriptions}

            Follow the instructions below to determine the best matching agent and provide a confidence score:

            Analysis Instructions (DO NOT include these instructions in the final answer):
            1. **Semantic Analysis:**
            - Identify the key topics, technical terms, and the user's intent from the query.
            - Compare these elements to each agent's detailed specialty description.
            - Focus on specific skills, tools, frameworks, and domain expertise mentioned.

            2. **Contextual Weighting:**
            - If the query strongly aligns with the current agent's known capabilities, add +0.15 confidence for direct core expertise and +0.1 for related domain knowledge.
            - If the query introduces new topics outside the current agent's domain, do not apply the current agent bias. Instead, evaluate all agents equally based on their described expertise.

            3. **Multi-Agent Evaluation:**
            - Consider all agents' described specialties thoroughly, not just the current agent.
            - For overlapping capabilities, favor the agent with more specialized expertise or more relevant tools/methodologies.
            - If no agent clearly surpasses a 0.5 confidence threshold, select the agent with the highest confidence score, even if it is below 0.5.

            4. **Confidence Scoring Guidelines:**
            - 0.9-1.0: Ideal match with the agent's core, primary expertise.
            - 0.7-0.9: Strong match with the agent's known capabilities.
            - 0.5-0.7: Partial or related match, not a direct specialty.
            - Below 0.5: Weak match; consider if another agent is more suitable, but still choose the best available option.

            Final Output Requirements:
            - Return ONLY the chosen agent_id and the confidence score in the format:
            `agent_id|confidence`

            Examples:
            - Direct expertise match: `debugging_agent|0.95`
            - Related capability (current agent): `current_agent_id|0.75`
            - Need different expertise: `ml_training_agent|0.85`
            - Overlapping domains, choose more specialized: `choose_higher_expertise_agent|0.80`
            """

            messages = [
                {
                    "role": "system",
                    "content": "You are an expert agent classifier that helps route queries to the most appropriate agent.",
                },
                {"role": "user", "content": prompt},
            ]

            async def classifier_node(self, state: State) -> Command:
                # 使用 LLM 分析查询意图
                prompt = self.classifier_prompt.format(
                    query=state["query"],
                    agent_id=state["agent_id"],
                    agent_descriptions=self.agent_descriptions,
                )
                
                # 调用 LLM 进行分类
                response = await self.provider_service.call_llm(messages=messages, size="small")
        ```

    2. 查询意图分析：

        在 `ClassificationPrompts` 中定义了查询分类规则和提示词：

        AgentType.QNA
        AgentType.DEBUGGING
        AgentType.UNIT_TEST
        AgentType.INTEGRATION_TEST
        AgentType.CODE_CHANGES
        AgentType.LLD

    3. 节点定位策略 ：

        以 `DebugRAGAgent` 为例，它使用多个工具进行节点定位：

        ```python
        def __init__(self, sql_db, llm, mini_llm, user_id):
            # 初始化各种查询工具
            self.get_code_from_node_id = get_code_from_node_id_tool(sql_db, user_id)
            self.get_code_from_probable_node_name = get_code_from_probable_node_name_tool(sql_db, user_id)
            self.get_nodes_from_tags = get_nodes_from_tags_tool(sql_db, user_id)
        ```

        get_code_from_probable_node_name_tool 的输入:

        ```json
        {
            "project_id": "550e8400-e29b-41d4-a716-446655440000",
            "probable_node_names": [
                "src/services/auth.ts:validateToken",
                "src/models/User.ts:User"
            ]
        }
        ```

        给query_agent的任务:

        ```python
        Task(
                description=f"""
                Adhere to {self.max_iter} iterations max. Analyze input:

                - Chat History: {chat_history}
                - Query: {query}
                - Project ID: {project_id}
                - User Node IDs: {[node.model_dump() for node in node_ids]}
                - File Structure upto depth 4:
                    {file_structure}
                - Code Results for user node ids: {code_results}

                1. Analyze project structure:

                - Identify key directories, files, and modules
                - Guide search strategy and provide context
                - For directories of interest that show "└── ...", use "Get Code File Structure" tool with the directory path to reveal nested files
                - Only after getting complete file paths, use "Get Code and docstring From Probable Node Name" tool
                - Locate relevant files or subdirectory path


                Directory traversal strategy:

                - Start with high-level file structure analysis
                - When encountering a directory with hidden contents (indicated by "└── ..."):
                    a. First: Use "Get Code File Structure" tool with the directory path
                    b. Then: From the returned structure, identify relevant files
                    c. Finally: Use "Get Code and docstring From Probable Node Name" tool with the complete file paths
                - Subdirectories with hidden nested files are followed by "│   │   │          └── ..."


                2. Initial context retrieval:
                - Analyze provided Code Results for user node ids
                - If code results are not relevant move to next step`

                3. Knowledge graph query (if needed):
                - Transform query for knowledge graph tool
                - Execute query and analyze results

                Additional context retrieval (if needed):

                - For each relevant directory with hidden contents:
                    a. FIRST: Call "Get Code File Structure" tool with directory path
                    b. THEN: From returned structure, extract complete file paths
                    c. THEN: For each relevant file, call "Get Code and docstring From Probable Node Name" tool
                - Never call "Get Code and docstring From Probable Node Name" tool with directory paths
                - Always ensure you have complete file paths before using the probable node tool
                - Extract hidden file names from the file structure subdirectories that seem relevant
                - Extract probable node names. Nodes can be files or functions/classes. But not directories.


                5. Use "Get Nodes from Tags" tool as last resort only if absolutely necessary

                6. Analyze and enrich results:
                - Evaluate relevance, identify gaps
                - Develop scoring mechanism
                - Retrieve code only if docstring insufficient

                7. Compose response:
                - Organize results logically
                - Include citations and references
                - Provide comprehensive, focused answer

                8. Final review:
                - Check coherence and relevance
                - Identify areas for improvement
                - Format the file paths as follows (only include relevant project details from file path):
                    path: potpie/projects/username-reponame-branchname-userid/gymhero/models/training_plan.py
                    output: gymhero/models/training_plan.py

                Note:

                -   Always traverse directories before attempting to access files
                - Never skip the directory structure retrieval step
                - Use available tools in the correct order: structure first, then code
                - Use markdown for code snippets with language name in the code block like python or javascript
                - Prioritize "Get Code and docstring From Probable Node Name" tool for stacktraces or specific file/function mentions
                - Prioritize "Get Code File Structure" tool to get the nested file structure of a relevant subdirectory when deeper levels are not provided
                - Use available tools as directed
                - Proceed to next step if insufficient information found

                Ground your responses in provided code context and tool results. Use markdown for code snippets. Be concise and avoid repetition. If unsure, state it clearly. For debugging, unit testing, or unrelated code explanations, suggest specialized agents.
                Tailor your response based on question type:

                - New questions: Provide comprehensive answers
                - Follow-ups: Build on previous explanations from the chat history
                - Clarifications: Offer clear, concise explanations
                - Comments/feedback: Incorporate into your understanding

                Indicate when more information is needed. Use specific code references. Adapt to user's expertise level. Maintain a conversational tone and context from previous exchanges.
                Ask clarifying questions if needed. Offer follow-up suggestions to guide the conversation.
                Provide a comprehensive response with deep context, relevant file paths, include relevant code snippets wherever possible. Format it in markdown format.
                """,
                expected_output=(
                    "Markdown formatted chat response to user's query grounded in provided code context and tool results"
                ),
                agent=query_agent,
            )
        ```

    4. 定位过程：

        a. 名称直接匹配：

        ```python
        # 如果用户直接提到了具体的函数/类名
        result = await get_code_from_node_name_tool.run({
            "project_id": project_id,
            "node_name": "UserService:authenticateUser"
        })
        ```

        b. find_node_from_probable_names

        Agent获取到仓库文件结构后,可以调用这个工具,获取可能的节点名称. 这个工具内部调用`SearchService.search_codebase`查询postgresql, 然后计算相关性, 来模糊查询可能的节点.  

        c. 标签系统：

        ```python
        # 通过功能标签查找相关节点
        nodes = await get_nodes_from_tags_tool.run({
            "project_id": project_id,
            "tags": ["AUTH", "API"]  # 根据问题上下文推断的标签
        })
        ```

        d. 使用知识图谱进行关联查询：

        ```python
        # 查询相关节点
        neighbours = await get_node_neighbours_from_node_id_tool.run({
            "project_id": project_id,
            "node_ids": [node_id]
        })
        ```

    5. 优先级策略 ：
    - 精确匹配 > 标签匹配 > 模糊匹配
    - 当前上下文相关节点优先
    - 根据代码调用关系确定重要性
    这个过程是自适应的，会根据：
        1. 用户问题的具体性
        2. 当前对话上下文
        3. 代码库的结构
        4. 标签系统的分类
    来决定从哪个节点开始查询。如果用户问题比较模糊，系统会通过多个维度（标签、关系、上下文）来确定最相关的起始节点。

    A. 定位代码：

    ```python
        # 使用 get_code_from_node_name_tool
        result = await get_code_from_node_name_tool.run({
                "project_id": project_id,
                "node_name": "src/services/UserService.ts:authenticateUser"
            })
    ```

    B. 获取上下文：

    ```python

    # 使用 get_node_neighbours_from_node_id_tool 获取相关节点
    neighbours = await get_node_neighbours_from_node_id_tool.run({
        "project_id": project_id,
        "node_ids": [node_id]
    })
    ```

    C. 查询知识图谱：

    ```python

        # 使用 ask_knowledge_graph_queries_tool
        kg_info = await ask_knowledge_graph_queries_tool.run({
            "project_id": project_id,
            "node_ids": [node_id],
            "queries": [
                "这个函数的主要依赖是什么？",
                "这个函数的调用链是怎样的？",
                "这个函数的错误处理机制是什么？"   
            ]})
    ```

## 数据查询流程

A. Neo4j 查询：

```cypher

// 1. 查询函数节点
MATCH (n:NODE {repoId: $project_id})
WHERE toLower(n.name) = toLower($node_name)
RETURN n;

// 2. 查询关系
MATCH (n:NODE {node_id: $node_id})-[r]->(m:NODE)
RETURN n, r, m;

// 3. 查询调用链
MATCH path = (n:NODE {node_id: $node_id})-[:CALLS*]->(m:NODE)
RETURN path;
```

B. PostgreSQL 查询：

```sql

-- 1. 获取项目信息
SELECT * FROM projects WHERE id = $project_id;
-- 2. 获取代码节点
SELECT * FROM code_nodes WHERE project_id = $project_id AND name = $node_name;
-- 3. 获取标签信息
SELECT * FROM node_tags WHERE node_id = $node_id;
```

数据整合与响应：

```python
response_context = {    
    "code": code_info,              # 函数代码    
    "neighbours": neighbours,        # 相关节点    
    "knowledge_graph": kg_info,     # 知识图谱信息    
    "tags": tags,                   # 代码标签    
    "dependencies": dependencies    # 依赖关系
}
# 生成回答
response = await agent.generate_response(
    user_query=message.content,    
    context=response_context
)
```

数据流图：

```plaintext

用户问题
   ↓
对话控制器
   ↓
AI Agent
   ↓
工具调用 ──→ 代码查询工具 ──→ PostgreSQL
   ↓          ↓
知识图谱工具 ←─┘
   ↓
Neo4j 查询
   ↓
数据整合
   ↓
生成响应
    ↓
返回用户
```
