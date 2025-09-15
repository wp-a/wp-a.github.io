// 工地检测助手 JavaScript 功能

class ConstructionDetection {
  constructor() {
    // 🔑 API配置 - 请在此处配置您的大模型API
    this.apiEndpoint = 'https://api.openai.com/v1/chat/completions'; // OpenAI API端点
    this.apiKey = ''; // ⚠️ 请在此处填入您的API密钥，或使用环境变量
    
    // 💡 其他可用的API端点示例：
    // this.apiEndpoint = 'https://your-custom-api.com/v1/chat/completions'; // 自定义API
    // this.apiKey = process.env.OPENAI_API_KEY || 'your-api-key-here'; // 使用环境变量
    
    this.currentImage = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadUserPreferences();
  }

  setupEventListeners() {
    // 文件上传相关
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const removeBtn = document.getElementById('removeBtn');
    const detectBtn = document.getElementById('detectBtn');
    const clearBtn = document.getElementById('clearBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const shareBtn = document.getElementById('shareBtn');

    // 上传区域点击事件
    uploadArea.addEventListener('click', () => {
      imageInput.click();
    });

    // 文件输入变化事件
    imageInput.addEventListener('change', (e) => {
      this.handleFileSelect(e.target.files[0]);
    });

    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.handleFileSelect(files[0]);
      }
    });

    // 移除图片
    removeBtn.addEventListener('click', () => {
      this.removeImage();
    });

    // 开始检测
    detectBtn.addEventListener('click', () => {
      this.startDetection();
    });

    // 清空重置
    clearBtn.addEventListener('click', () => {
      this.clearAll();
    });

    // 下载报告
    downloadBtn.addEventListener('click', () => {
      this.downloadReport();
    });

    // 分享结果
    shareBtn.addEventListener('click', () => {
      this.shareResults();
    });

    // 检测选项变化
    const checkboxes = document.querySelectorAll('.option-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateDetectButton();
      });
    });
  }

  handleFileSelect(file) {
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      this.showNotification('请选择图片文件', 'error');
      return;
    }

    // 验证文件大小 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      this.showNotification('图片大小不能超过10MB', 'error');
      return;
    }

    this.currentImage = file;
    this.displayImagePreview(file);
    this.updateDetectButton();
  }

  displayImagePreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.getElementById('imagePreview');
      const previewImg = document.getElementById('previewImg');
      const uploadArea = document.getElementById('uploadArea');

      previewImg.src = e.target.result;
      preview.style.display = 'block';
      uploadArea.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.currentImage = null;
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('imageInput').value = '';
    this.updateDetectButton();
  }

  updateDetectButton() {
    const detectBtn = document.getElementById('detectBtn');
    const hasImage = this.currentImage !== null;
    const hasSelectedOptions = this.getSelectedOptions().length > 0;

    detectBtn.disabled = !(hasImage && hasSelectedOptions);
  }

  getSelectedOptions() {
    const checkboxes = document.querySelectorAll('.option-item input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
  }

  async startDetection() {
    if (!this.currentImage) {
      this.showNotification('请先上传图片', 'error');
      return;
    }

    const selectedOptions = this.getSelectedOptions();
    if (selectedOptions.length === 0) {
      this.showNotification('请至少选择一种检测类型', 'error');
      return;
    }

    // 检查API密钥配置
    if (!this.apiKey || this.apiKey.trim() === '') {
      this.showNotification('请先配置API密钥，详情请查看API配置说明', 'error');
      this.showApiConfigModal();
      return;
    }

    const customPrompt = document.getElementById('customPrompt').value.trim();
    
    // 显示加载状态
    this.setLoadingState(true);
    this.showResultsSection(false);

    try {
      // 将图片转换为base64
      const imageBase64 = await this.imageToBase64(this.currentImage);
      
      // 构建检测提示词
      const detectionPrompt = this.buildDetectionPrompt(selectedOptions, customPrompt);
      
      // 调用AI API
      const result = await this.callAIApi(imageBase64, detectionPrompt);
      
      // 显示结果
      this.displayResults(result);
      this.showResultsSection(true);
      
    } catch (error) {
      console.error('检测失败:', error);
      if (error.message.includes('API')) {
        this.showNotification('API调用失败，请检查API密钥和网络连接', 'error');
      } else {
        this.showNotification('检测失败，请重试', 'error');
      }
    } finally {
      this.setLoadingState(false);
    }
  }

  async imageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  buildDetectionPrompt(selectedOptions, customPrompt) {
    const optionNames = {
      'safety': '安全检测',
      'progress': '进度监控', 
      'equipment': '设备检查',
      'personnel': '人员管理',
      'environment': '环境评估'
    };

    let prompt = `请对这张工地图片进行专业的检测分析。请重点分析以下方面：\n\n`;
    
    selectedOptions.forEach(option => {
      prompt += `- ${optionNames[option]}\n`;
    });

    if (customPrompt) {
      prompt += `\n特别关注：\n${customPrompt}\n`;
    }

    prompt += `\n请按以下格式提供分析报告：
1. 总体评估
2. 发现的问题（如有）
3. 改进建议
4. 风险等级评估

请确保分析专业、准确，并提供具体的改进建议。`;

    return prompt;
  }

  async callAIApi(imageBase64, prompt) {
    // 注意：这里需要配置实际的API密钥
    // 建议使用环境变量或配置文件来存储API密钥
    
    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  displayResults(result) {
    const resultsContent = document.getElementById('resultsContent');
    const detectionTime = document.getElementById('detectionTime');
    const imageInfo = document.getElementById('imageInfo');

    // 格式化结果显示
    const formattedResult = this.formatResult(result);
    resultsContent.innerHTML = formattedResult;

    // 更新时间信息
    detectionTime.textContent = `检测时间: ${new Date().toLocaleString()}`;
    imageInfo.textContent = `图片信息: ${this.currentImage.name} (${(this.currentImage.size / 1024 / 1024).toFixed(2)}MB)`;
  }

  formatResult(result) {
    // 将结果格式化为HTML
    const lines = result.split('\n');
    let html = '';

    lines.forEach(line => {
      line = line.trim();
      if (line === '') return;

      if (line.match(/^\d+\./)) {
        // 编号列表项
        html += `<div class="result-item numbered"><h4>${line}</h4></div>`;
      } else if (line.startsWith('##') || line.startsWith('**') || line.includes('：')) {
        // 标题或强调内容
        html += `<div class="result-item title"><h3>${line}</h3></div>`;
      } else if (line.startsWith('-') || line.startsWith('•')) {
        // 列表项
        html += `<div class="result-item list-item"><p>${line}</p></div>`;
      } else {
        // 普通段落
        html += `<div class="result-item paragraph"><p>${line}</p></div>`;
      }
    });

    return html;
  }

  setLoadingState(loading) {
    const detectBtn = document.getElementById('detectBtn');
    const btnText = detectBtn.querySelector('.btn-text');
    const btnLoading = detectBtn.querySelector('.btn-loading');

    if (loading) {
      detectBtn.disabled = true;
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline-block';
    } else {
      detectBtn.disabled = false;
      btnText.style.display = 'inline-block';
      btnLoading.style.display = 'none';
    }
  }

  showResultsSection(show) {
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = show ? 'block' : 'none';
    
    if (show) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  clearAll() {
    // 重置所有状态
    this.removeImage();
    document.getElementById('customPrompt').value = '';
    
    // 重置所有选项为选中状态
    const checkboxes = document.querySelectorAll('.option-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = true;
    });
    
    this.showResultsSection(false);
    this.updateDetectButton();
    this.showNotification('已清空所有内容', 'success');
  }

  downloadReport() {
    const resultsContent = document.getElementById('resultsContent').innerText;
    const detectionTime = document.getElementById('detectionTime').textContent;
    const imageInfo = document.getElementById('imageInfo').textContent;
    
    const report = `工地检测报告\n${detectionTime}\n${imageInfo}\n\n${resultsContent}`;
    
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `工地检测报告_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    this.showNotification('报告已下载', 'success');
  }

  shareResults() {
    const resultsContent = document.getElementById('resultsContent').innerText;
    
    if (navigator.share) {
      navigator.share({
        title: '工地检测报告',
        text: resultsContent.substring(0, 100) + '...',
        url: window.location.href
      });
    } else {
      // 复制到剪贴板
      navigator.clipboard.writeText(resultsContent).then(() => {
        this.showNotification('检测结果已复制到剪贴板', 'success');
      }).catch(() => {
        this.showNotification('复制失败，请手动复制', 'error');
      });
    }
  }

  showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '6px',
      color: 'white',
      fontWeight: '500',
      zIndex: '10000',
      opacity: '0',
      transform: 'translateX(100%)',
      transition: 'all 0.3s ease'
    });

    // 设置背景色
    const colors = {
      success: '#52c41a',
      error: '#ff4d4f',
      warning: '#faad14',
      info: '#1890ff'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    document.body.appendChild(notification);

    // 显示动画
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 100);

    // 自动隐藏
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  loadUserPreferences() {
    // 加载用户偏好设置
    const savedOptions = localStorage.getItem('construction-detection-options');
    if (savedOptions) {
      const options = JSON.parse(savedOptions);
      Object.keys(options).forEach(key => {
        const checkbox = document.querySelector(`input[value="${key}"]`);
        if (checkbox) {
          checkbox.checked = options[key];
        }
      });
    }
  }

  saveUserPreferences() {
    // 保存用户偏好设置
    const options = {};
    const checkboxes = document.querySelectorAll('.option-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      options[checkbox.value] = checkbox.checked;
    });
    localStorage.setItem('construction-detection-options', JSON.stringify(options));
  }

  showApiConfigModal() {
    const modal = document.createElement('div');
    modal.className = 'api-config-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>🔑 API配置说明</h3>
          <button class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <p><strong>为了使用工地检测功能，您需要配置大模型API密钥。</strong></p>
          
          <h4>配置步骤：</h4>
          <ol>
            <li>获取OpenAI API密钥（或其他兼容的API服务）</li>
            <li>在 <code>/source/js/construction-detection.js</code> 文件中找到 <code>this.apiKey</code> 配置</li>
            <li>将您的API密钥填入该配置项</li>
            <li>重新部署网站</li>
          </ol>
          
          <h4>支持的API服务：</h4>
          <ul>
            <li>OpenAI GPT-4 Vision</li>
            <li>Azure OpenAI Service</li>
            <li>其他兼容OpenAI API格式的服务</li>
          </ul>
          
          <div class="config-example">
            <h4>配置示例：</h4>
            <pre><code>// 在 construction-detection.js 中修改
this.apiKey = 'your-api-key-here';</code></pre>
          </div>
          
          <p><strong>详细配置说明请查看：</strong> <a href="/construction-detection/api-config/" target="_blank">API配置文档</a></p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">我知道了</button>
        </div>
      </div>
    `;

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .api-config-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
      }
      .modal-content {
        background: white;
        border-radius: 12px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      }
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
      }
      .modal-header h3 {
        margin: 0;
        color: #333;
      }
      .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #999;
      }
      .modal-body {
        padding: 20px;
        line-height: 1.6;
      }
      .modal-body h4 {
        color: #49b1f5;
        margin-top: 20px;
        margin-bottom: 10px;
      }
      .modal-body ol, .modal-body ul {
        margin: 10px 0;
        padding-left: 20px;
      }
      .config-example {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        margin: 15px 0;
      }
      .config-example pre {
        margin: 0;
        background: #2d3748;
        color: #e2e8f0;
        padding: 10px;
        border-radius: 4px;
        overflow-x: auto;
      }
      .modal-footer {
        padding: 20px;
        border-top: 1px solid #eee;
        text-align: right;
      }
      .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
      }
      .btn-primary {
        background: #49b1f5;
        color: white;
      }
      .btn-primary:hover {
        background: #0084ff;
      }
      [data-theme="dark"] .modal-content {
        background: #2a2a2a;
        color: #e1e1e1;
      }
      [data-theme="dark"] .modal-header {
        border-bottom-color: #444;
      }
      [data-theme="dark"] .modal-footer {
        border-top-color: #444;
      }
      [data-theme="dark"] .config-example {
        background: #333;
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(modal);

    // 关闭按钮事件
    modal.querySelector('.close-btn').addEventListener('click', () => {
      modal.remove();
      style.remove();
    });

    // 点击背景关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
        style.remove();
      }
    });
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  new ConstructionDetection();
});

// 添加结果样式
const resultStyles = `
.result-item {
  margin-bottom: 15px;
  padding: 12px;
  border-radius: 8px;
  background: #f8f9fa;
}

.result-item.title {
  background: linear-gradient(135deg, #49b1f5 0%, #0084ff 100%);
  color: white;
}

.result-item.title h3 {
  margin: 0;
  font-size: 18px;
}

.result-item.numbered {
  background: #e8f4fd;
  border-left: 4px solid #49b1f5;
}

.result-item.numbered h4 {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.result-item.list-item {
  background: #f0f8ff;
  border-left: 3px solid #87ceeb;
}

.result-item.list-item p {
  margin: 0;
  color: #555;
}

.result-item.paragraph p {
  margin: 0;
  line-height: 1.6;
  color: #333;
}

[data-theme="dark"] .result-item {
  background: #333;
  color: #e1e1e1;
}

[data-theme="dark"] .result-item.numbered {
  background: #2a3a4a;
  border-left-color: #49b1f5;
}

[data-theme="dark"] .result-item.list-item {
  background: #2a2a3a;
  border-left-color: #87ceeb;
}
`;

// 注入样式
const styleSheet = document.createElement('style');
styleSheet.textContent = resultStyles;
document.head.appendChild(styleSheet);
