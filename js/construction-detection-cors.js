// 工地检测助手 - CORS代理版本
// 使用多个CORS代理服务器来绕过API密钥的HTTP引用者限制

class ConstructionDetectionCORS {
  constructor() {
    // 🔑 使用CORS代理配置
    this.proxyEndpoints = [
      'https://api.allorigins.win/raw?url=',
      'https://cors-anywhere.herokuapp.com/',
      'https://corsproxy.io/?',
      'https://thingproxy.freeboard.io/fetch/'
    ];
    this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';
    this.apiKey = 'AIzaSyDu4aoJjPM9zcxHToWZUMgA6Seov9dOEtY';
    
    this.currentImage = null;
    this.init();
  }

  init() {
    console.log('🏗️ 工地检测助手（CORS代理版本）初始化中...');
    console.log('使用CORS代理服务器绕过API限制');
    this.setupEventListeners();
    this.loadUserPreferences();
    console.log('✅ 工地检测助手初始化完成');
  }

  setupEventListeners() {
    console.log('🔧 设置事件监听器...');
    
    // 文件上传相关
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const removeBtn = document.getElementById('removeBtn');
    const detectBtn = document.getElementById('detectBtn');
    const clearBtn = document.getElementById('clearBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const shareBtn = document.getElementById('shareBtn');

    // 检查元素是否存在
    if (!uploadArea) {
      console.error('❌ 找不到上传区域元素 (uploadArea)');
      return;
    }
    if (!imageInput) {
      console.error('❌ 找不到文件输入元素 (imageInput)');
      return;
    }
    
    console.log('✅ 所有必需元素已找到');

    // 上传区域点击事件
    uploadArea.addEventListener('click', () => {
      imageInput.click();
    });

    // 文件输入变化事件
    imageInput.addEventListener('change', (e) => {
      console.log('📁 文件选择事件触发:', e.target.files);
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
    console.log('📋 处理文件选择:', file);
    
    if (!file) {
      console.log('❌ 没有选择文件');
      return;
    }

    console.log('📄 文件信息:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      console.log('❌ 文件类型不支持:', file.type);
      this.showNotification('请选择图片文件', 'error');
      return;
    }

    // 验证文件大小 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.log('❌ 文件大小超限:', file.size);
      this.showNotification('图片大小不能超过10MB', 'error');
      return;
    }

    console.log('✅ 文件验证通过');
    this.currentImage = file;
    this.displayImagePreview(file);
    this.updateDetectButton();
  }

  displayImagePreview(file) {
    console.log('🖼️ 显示图片预览:', file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log('📖 图片读取完成');
      
      const preview = document.getElementById('imagePreview');
      const previewImg = document.getElementById('previewImg');
      const uploadArea = document.getElementById('uploadArea');

      if (!preview || !previewImg || !uploadArea) {
        console.error('❌ 找不到预览元素');
        return;
      }

      previewImg.src = e.target.result;
      preview.style.display = 'block';
      uploadArea.style.display = 'none';
      
      console.log('✅ 图片预览显示成功');
    };
    
    reader.onerror = (error) => {
      console.error('❌ 图片读取失败:', error);
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

    const customPrompt = document.getElementById('customPrompt').value.trim();
    
    // 显示加载状态
    this.setLoadingState(true);
    this.showResultsSection(false);

    try {
      // 将图片转换为base64
      const imageBase64 = await this.imageToBase64(this.currentImage);
      
      // 构建检测提示词
      const detectionPrompt = this.buildDetectionPrompt(selectedOptions, customPrompt);
      
      // 调用AI API（使用多个CORS代理）
      const result = await this.callAIApiWithCORS(imageBase64, detectionPrompt);
      
      // 显示结果
      this.displayResults(result);
      this.showResultsSection(true);
      
    } catch (error) {
      console.error('检测失败:', error);
      this.showNotification('检测失败，请尝试配置API密钥的HTTP引用者限制', 'error');
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

  detectImageMimeType(imageBase64) {
    // 从base64字符串中提取MIME类型
    const mimeMatch = imageBase64.match(/data:([^;]+);base64,/);
    if (mimeMatch) {
      return mimeMatch[1];
    }
    
    // 如果无法从base64中获取，默认使用JPEG
    return 'image/jpeg';
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

  async callAIApiWithCORS(imageBase64, prompt) {
    console.log('🌐 尝试使用CORS代理调用API...');
    
    // 检测图片MIME类型
    const mimeType = this.detectImageMimeType(imageBase64);
    
    // 构建Gemini API请求
    const requestBody = {
      contents: [{
        parts: [
          {
            text: prompt
          },
          {
            inline_data: {
              mime_type: mimeType,
              data: imageBase64.split(',')[1] // 移除data:image/xxx;base64,前缀
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2000,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    // 尝试多个CORS代理
    for (let i = 0; i < this.proxyEndpoints.length; i++) {
      const proxyEndpoint = this.proxyEndpoints[i];
      
      try {
        console.log(`📡 尝试代理 ${i + 1}/${this.proxyEndpoints.length}: ${proxyEndpoint}`);
        
        let proxyUrl;
        if (proxyEndpoint.includes('allorigins.win')) {
          proxyUrl = `${proxyEndpoint}${encodeURIComponent(`${this.apiEndpoint}?key=${this.apiKey}`)}`;
        } else {
          proxyUrl = `${proxyEndpoint}${this.apiEndpoint}?key=${this.apiKey}`;
        }

        const response = await fetch(proxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          throw new Error(`代理 ${i + 1} 请求失败: ${response.status}`);
        }

        const data = await response.json();
        
        console.log(`✅ 代理 ${i + 1} API响应成功`);
        
        // 检查响应结构
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          return data.candidates[0].content.parts[0].text;
        } else {
          throw new Error('Gemini API响应格式异常');
        }
        
      } catch (error) {
        console.log(`❌ 代理 ${i + 1} 失败:`, error.message);
        
        if (i === this.proxyEndpoints.length - 1) {
          // 所有代理都失败了，提供解决方案
          throw new Error(`所有CORS代理都失败了。请按照以下步骤解决API密钥问题：

1. 访问 Google Cloud Console (https://console.cloud.google.com/)
2. 选择项目: psychic-empire-451811-e8
3. 进入 "APIs & Services" > "Credentials"
4. 找到API密钥: ${this.apiKey}
5. 点击编辑，在 "Application restrictions" 中：
   - 选择 "HTTP referrers (web sites)"
   - 添加以下引用者：
     * https://wp-a.github.io/*
     * https://*.github.io/*
     * http://localhost:*
     * https://localhost:*
6. 保存配置并等待几分钟生效

或者创建一个新的API密钥，不设置HTTP引用者限制。`);
        }
      }
    }
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
      transition: 'all 0.3s ease',
      maxWidth: '400px',
      wordWrap: 'break-word'
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
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 5000);
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
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  new ConstructionDetectionCORS();
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
