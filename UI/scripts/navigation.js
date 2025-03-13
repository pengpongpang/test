// 导航功能实现

// 项目卡片按钮点击处理
function initializeProjectCardButtons() {
    const viewButtons = document.querySelectorAll('.action-btn.view');
    const chatButtons = document.querySelectorAll('.action-btn.chat');

    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectCard = this.closest('.project-card');
            const projectName = projectCard.querySelector('h3').textContent;
            const repository = projectCard.querySelector('.value').textContent;
            // 跳转到项目详情页面
            window.location.href = `./project-details.html?project=${encodeURIComponent(projectName)}&repo=${encodeURIComponent(repository)}`;
        });
    });

    chatButtons.forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', function() {
                const projectCard = this.closest('.project-card');
                const projectName = projectCard.querySelector('h3').textContent;
                const repository = projectCard.querySelector('.value').textContent;
                // 跳转到聊天页面
                window.location.href = `../conversations/chat.html?project=${encodeURIComponent(projectName)}&repo=${encodeURIComponent(repository)}`;
            });
        }
    });
}

// 搜索结果文件链接点击处理
function initializeSearchResults() {
    const fileLinks = document.querySelectorAll('.file-path');
    
    fileLinks.forEach(link => {
        link.style.cursor = 'pointer';
        link.addEventListener('click', function() {
            const filePath = this.textContent;
            // 跳转到文件详情页面
            window.location.href = `./file-details.html?path=${encodeURIComponent(filePath)}`;
        });
    });
}

// 页面加载时初始化导航功能
document.addEventListener('DOMContentLoaded', function() {
    // 根据当前页面URL判断需要初始化的功能
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/projects/')) {
        initializeProjectCardButtons();
    } else if (currentPath.includes('/search/')) {
        initializeSearchResults();
    }
});