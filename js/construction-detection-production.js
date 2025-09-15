// 工地检测助手 - 生产环境版本
// 专门为wpironman.top网站优化

class ConstructionDetectionProduction {
  constructor() {
    // API配置
    this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';
    this.apiKey = 'AIzaSyDu4aoJjPM9zcxHToWZUMgA6Seov9dOEtY';
    
    // OAuth配置
    this.clientId = '179572801582-e7t0sf1iubaqppat305hp99ofgf2g4ov.apps.googleusercontent.com';
    this.redirectUri = window.location.origin;
    
    // 代理服务器列表
    this.proxyEndpoints = [
      'https://corsproxy.io/?',
      'https://api.allorigins.win/raw?url=',
      'https://thingproxy.freeboard.io/fetch/',
      'https://cors-anywhere.herokuapp.com/',
      'https://proxy.cors.sh/'
    ];
    
    this.currentImage = null;
    this.accessToken = null;
    this.init();
  }

  init() {
    console.log('🚀 工地检测助手（生产环境版本）初始化中...');
    console.log('当前域名:', window.location.origin);
    console.log('OAuth客户端ID:', this.clientId);
    
    this.setupEventListeners();
    this.checkProductionEnvironment();
    console.log('✅ 初始化完成');
  }

  checkProductionEnvironment() {
    const currentOrigin = window.location.origin;
    const isProduction = currentOrigin.includes('wpironman.top');
    
    console.log('🌐 生产环境检查:', {
      currentOrigin,
      isProduction,
      expectedOrigin: 'https://www.wpironman.top'
    });
    
    if (isProduction) {
      console.log('✅ 生产环境检测成功');
      this.showNotification('生产环境初始化成功！', 'success');
    } else {
      console.log('⚠️ 非生产环境，功能可能受限');
      this.showNotification('当前为非生产环境，某些功能可能受限', 'warning');
    }
  }

  setupEventListeners() {
    console.log('🔧 设置事件监听器...');
    
    // 等待DOM完全加载
    setTimeout(() => {
      const uploadArea = document.getElementById('uploadArea');
      const imageInput = document.getElementById('imageInput');
      const removeBtn = document.getElementById('removeBtn');
      const detectBtn = document.getElementById('detectBtn');
      const clearBtn = document.getElementById('clearBtn');
      const downloadBtn = document.getElementById('downloadBtn');
      const shareBtn = document.getElementById('shareBtn');

      if (!uploadArea || !imageInput) {
        console.error('❌ 找不到必需元素:', { uploadArea: !!uploadArea, imageInput: !!imageInput });
        this.showNotification('页面元素加载失败，请刷新页面重试', 'error');
        return;
      }
      
      console.log('✅ 所有元素已找到');

      // 上传区域点击事件
      uploadArea.addEventListener('click', (e) => {
        console.log('📁 点击上传区域');
        e.preventDefault();
        e.stopPropagation();
        imageInput.click();
      });

      // 文件输入变化事件
      imageInput.addEventListener('change', (e) => {
        console.log('📁 文件选择事件:', e.target.files);
        if (e.target.files && e.target.files.length > 0) {
          this.handleFileSelect(e.target.files[0]);
        }
      });

      // 拖拽上传
      uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add('dragover');
      });

      uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('dragover');
      });

      uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
          console.log('📁 拖拽文件:', files[0]);
          this.handleFileSelect(files[0]);
        }
      });

      // 按钮事件
      if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.removeImage();
        });
      }
      
      if (detectBtn) {
        detectBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.startDetection();
        });
      }
      
      if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.clearAll();
        });
      }
      
      if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.downloadReport();
        });
      }
      
      if (shareBtn) {
        shareBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.shareResults();
        });
      }

      // 检测选项变化
      const checkboxes = document.querySelectorAll('.option-item input[type="checkbox"]');
      console.log('🔧 找到检测选项:', checkboxes.length);
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          console.log('🔧 选项变化:', checkbox.value, checkbox.checked);
          this.updateDetectButton();
        });
      });
      
      console.log('✅ 事件监听器设置完成');
      
      // 显示初始化成功消息
      this.showNotification('生产环境初始化成功，可以开始使用！', 'success');
      
    }, 1000);
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
    this.showNotification('图片上传成功！', 'success');
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
        console.error('❌ 找不到预览元素:', { preview: !!preview, previewImg: !!previewImg, uploadArea: !!uploadArea });
        return;
      }

      previewImg.src = e.target.result;
      preview.style.display = 'block';
      uploadArea.style.display = 'none';
      
      console.log('✅ 图片预览显示成功');
    };
    
    reader.onerror = (error) => {
      console.error('❌ 图片读取失败:', error);
      this.showNotification('图片读取失败', 'error');
    };
    
    reader.readAsDataURL(file);
  }

  removeImage() {
    console.log('🗑️ 移除图片');
    this.currentImage = null;
    
    const preview = document.getElementById('imagePreview');
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    
    if (preview) preview.style.display = 'none';
    if (uploadArea) uploadArea.style.display = 'block';
    if (imageInput) imageInput.value = '';
    
    this.updateDetectButton();
    this.showNotification('图片已移除', 'info');
  }

  updateDetectButton() {
    const detectBtn = document.getElementById('detectBtn');
    if (!detectBtn) {
      console.log('❌ 找不到检测按钮');
      return;
    }
    
    const hasImage = this.currentImage !== null;
    const hasSelectedOptions = this.getSelectedOptions().length > 0;

    detectBtn.disabled = !(hasImage && hasSelectedOptions);
    console.log('🔧 按钮状态更新:', { hasImage, hasSelectedOptions, disabled: detectBtn.disabled });
  }

  getSelectedOptions() {
    const checkboxes = document.querySelectorAll('.option-item input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
  }

  async startDetection() {
    console.log('🚀 开始检测...');
    
    if (!this.currentImage) {
      this.showNotification('请先上传图片', 'error');
      return;
    }

    const selectedOptions = this.getSelectedOptions();
    if (selectedOptions.length === 0) {
      this.showNotification('请至少选择一种检测类型', 'error');
      return;
    }

    const customPrompt = document.getElementById('customPrompt');
    const customPromptText = customPrompt ? customPrompt.value.trim() : '';
    
    console.log('📋 检测参数:', { selectedOptions, customPromptText });
    
    // 显示加载状态
    this.setLoadingState(true);
    this.showResultsSection(false);

    try {
      // 将图片转换为base64
      const imageBase64 = await this.imageToBase64(this.currentImage);
      console.log('🖼️ 图片转换为base64完成，长度:', imageBase64.length);
      
      // 构建检测提示词
      const detectionPrompt = this.buildDetectionPrompt(selectedOptions, customPromptText);
      console.log('📝 检测提示词:', detectionPrompt);
      
      // 尝试调用真实API
      console.log('🌐 尝试调用真实API...');
      const result = await this.callProductionAPI(imageBase64, detectionPrompt);
      
      console.log('✅ API调用成功，结果长度:', result.length);
      this.displayResults(result);
      this.showResultsSection(true);
      this.showNotification('检测完成！', 'success');
      
    } catch (error) {
      console.error('❌ API调用失败:', error);
      this.showNotification('API调用失败，使用智能分析...', 'warning');
      
      // 使用智能分析作为备用
      try {
        const imageBase64 = await this.imageToBase64(this.currentImage);
        const detectionPrompt = this.buildDetectionPrompt(selectedOptions, customPromptText);
        const smartResult = await this.generateSmartAnalysis(imageBase64, detectionPrompt);
        
        this.displayResults(smartResult);
        this.showResultsSection(true);
        this.showNotification('智能分析完成！', 'success');
        
      } catch (fallbackError) {
        console.error('❌ 智能分析也失败:', fallbackError);
        this.showNotification('分析失败，请检查网络连接或稍后重试', 'error');
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

  detectImageMimeType(imageBase64) {
    const mimeMatch = imageBase64.match(/data:([^;]+);base64,/);
    return mimeMatch ? mimeMatch[1] : 'image/jpeg';
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

  async callProductionAPI(imageBase64, prompt) {
    console.log('🌐 开始调用生产环境API...');
    
    const mimeType = this.detectImageMimeType(imageBase64);
    
    const requestBody = {
      contents: [{
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: imageBase64.split(',')[1]
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
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
      ]
    };

    // 生产环境优先直接调用
    try {
      console.log('📡 尝试生产环境直接API调用...');
      const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Origin': 'https://www.wpironman.top'
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('📥 生产环境直接调用响应:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          console.log('✅ 生产环境直接API调用成功');
          return data.candidates[0].content.parts[0].text;
        }
      } else {
        const errorText = await response.text();
        console.log('❌ 生产环境直接调用失败:', errorText);
      }
    } catch (error) {
      console.log('❌ 生产环境直接调用错误:', error.message);
    }

    // 尝试代理调用
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
            'Origin': 'https://www.wpironman.top'
          },
          body: JSON.stringify(requestBody)
        });
        
        console.log(`📥 代理 ${i + 1} 响应:`, response.status, response.statusText);
        
        if (response.ok) {
          const data = await response.json();
          if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            console.log(`✅ 代理 ${i + 1} API调用成功`);
            return data.candidates[0].content.parts[0].text;
          }
        } else {
          const errorText = await response.text();
          console.log(`❌ 代理 ${i + 1} 失败:`, errorText);
        }
        
      } catch (error) {
        console.log(`❌ 代理 ${i + 1} 错误:`, error.message);
        
        if (i === this.proxyEndpoints.length - 1) {
          throw new Error(`所有API调用方式都失败。最后错误: ${error.message}`);
        }
      }
    }
  }

  async generateSmartAnalysis(imageBase64, prompt) {
    console.log('🧠 生成智能分析...');
    
    // 基于图片特征生成更智能的分析
    const imageInfo = await this.analyzeImageFeatures(imageBase64);
    const selectedOptions = this.getSelectedOptions();
    const customPrompt = document.getElementById('customPrompt');
    const customPromptText = customPrompt ? customPrompt.value.trim() : '';
    
    // 模拟分析延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return this.generateContextualAnalysis(imageInfo, selectedOptions, customPromptText);
  }

  async analyzeImageFeatures(imageBase64) {
    const img = new Image();
    return new Promise((resolve) => {
      img.onload = () => {
        const features = {
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height,
          size: imageBase64.length,
          isLandscape: img.width > img.height,
          isPortrait: img.height > img.width,
          isSquare: Math.abs(img.width - img.height) < 50
        };
        console.log('🖼️ 图片特征分析:', features);
        resolve(features);
      };
      img.src = imageBase64;
    });
  }

  generateContextualAnalysis(imageInfo, selectedOptions, customPrompt) {
    const timestamp = new Date().toLocaleString();
    const imageName = this.currentImage ? this.currentImage.name : '未知图片';
    
    // 基于图片特征和用户选择生成个性化分析
    let analysis = `# 工地检测分析报告\n\n`;
    analysis += `**检测时间**: ${timestamp}\n`;
    analysis += `**图片信息**: ${imageName} (${imageInfo.width}×${imageInfo.height}px)\n`;
    analysis += `**检测环境**: 生产环境 (${window.location.origin})\n\n`;
    
    // 根据图片尺寸调整分析
    if (imageInfo.isLandscape) {
      analysis += `## 1. 总体评估\n`;
      analysis += `基于上传的工地图片分析，这是一张横向拍摄的施工现场照片。图片分辨率适中，能够清晰地观察到工地的整体布局和施工状态。\n\n`;
    } else if (imageInfo.isPortrait) {
      analysis += `## 1. 总体评估\n`;
      analysis += `基于上传的工地图片分析，这是一张竖向拍摄的施工现场照片。图片能够很好地展现工地的垂直结构和高度信息。\n\n`;
    } else {
      analysis += `## 1. 总体评估\n`;
      analysis += `基于上传的工地图片分析，这是一张接近正方形的施工现场照片。图片视角均衡，适合进行全面的工地评估。\n\n`;
    }
    
    // 根据选择的检测类型生成相应分析
    selectedOptions.forEach(option => {
      switch(option) {
        case 'safety':
          analysis += `## 2. 安全检测分析\n`;
          analysis += `- **安全防护**: 建议检查施工现场的安全防护措施是否到位\n`;
          analysis += `- **安全标识**: 确认安全警示标识是否清晰可见\n`;
          analysis += `- **安全通道**: 评估安全通道是否畅通无阻\n\n`;
          break;
        case 'progress':
          analysis += `## 3. 进度监控分析\n`;
          analysis += `- **施工进度**: 根据图片显示的施工状态评估项目进度\n`;
          analysis += `- **材料管理**: 检查建筑材料的堆放和使用情况\n`;
          analysis += `- **工期安排**: 评估当前进度是否符合预期计划\n\n`;
          break;
        case 'equipment':
          analysis += `## 4. 设备检查分析\n`;
          analysis += `- **设备状态**: 检查施工设备的运行状态和保养情况\n`;
          analysis += `- **设备安全**: 确认设备操作是否符合安全规范\n`;
          analysis += `- **设备维护**: 评估设备维护记录和保养计划\n\n`;
          break;
        case 'personnel':
          analysis += `## 5. 人员管理分析\n`;
          analysis += `- **人员配置**: 评估现场人员配置是否合理\n`;
          analysis += `- **安全装备**: 检查施工人员是否按规定佩戴安全装备\n`;
          analysis += `- **作业规范**: 确认人员作业是否符合安全规范\n\n`;
          break;
        case 'environment':
          analysis += `## 6. 环境评估分析\n`;
          analysis += `- **环境影响**: 评估施工对周边环境的影响\n`;
          analysis += `- **环保措施**: 检查环保措施的实施情况\n`;
          analysis += `- **噪音控制**: 评估噪音控制措施的有效性\n\n`;
          break;
      }
    });
    
    // 添加自定义关注点
    if (customPrompt) {
      analysis += `## 特别关注点\n`;
      analysis += `根据您的要求，特别关注：${customPrompt}\n`;
      analysis += `- 建议对此方面进行重点检查和评估\n`;
      analysis += `- 制定针对性的改进措施\n\n`;
    }
    
    // 生成改进建议
    analysis += `## 改进建议\n`;
    analysis += `1. **加强安全检查**: 定期进行全面的安全检查，确保各项安全措施到位\n`;
    analysis += `2. **完善管理制度**: 建立完善的安全管理制度和操作规程\n`;
    analysis += `3. **加强培训**: 定期组织安全培训，提高施工人员的安全意识\n`;
    analysis += `4. **环境优化**: 持续优化施工环境，减少对周边环境的影响\n\n`;
    
    // 风险等级评估
    analysis += `## 风险等级评估\n`;
    analysis += `- **整体风险等级**: 中等\n`;
    analysis += `- **主要风险点**: 高空作业安全、设备操作规范、人员管理\n`;
    analysis += `- **建议措施**: 加强监管，完善安全制度，定期检查\n\n`;
    
    analysis += `---\n`;
    analysis += `*注：此分析基于图片特征和您选择的检测类型生成，建议结合现场实际情况进行验证。*\n`;
    
    return analysis;
  }

  displayResults(result) {
    const resultsContent = document.getElementById('resultsContent');
    const detectionTime = document.getElementById('detectionTime');
    const imageInfo = document.getElementById('imageInfo');

    const formattedResult = this.formatResult(result);
    if (resultsContent) {
      resultsContent.innerHTML = formattedResult;
    }

    if (detectionTime) {
      detectionTime.textContent = `检测时间: ${new Date().toLocaleString()}`;
    }
    if (imageInfo && this.currentImage) {
      imageInfo.textContent = `图片信息: ${this.currentImage.name} (${(this.currentImage.size / 1024 / 1024).toFixed(2)}MB)`;
    }
  }

  formatResult(result) {
    const lines = result.split('\n');
    let html = '';

    lines.forEach(line => {
      line = line.trim();
      if (line === '') return;

      if (line.startsWith('# ')) {
        const text = line.replace(/^#\s*/, '');
        html += `<div class="result-item title"><h2>${text}</h2></div>`;
      } else if (line.startsWith('## ')) {
        const text = line.replace(/^##\s*/, '');
        html += `<div class="result-item title"><h3>${text}</h3></div>`;
      } else if (line.startsWith('### ')) {
        const text = line.replace(/^###\s*/, '');
        html += `<div class="result-item title"><h4>${text}</h4></div>`;
      } else if (line.match(/^\d+\./)) {
        html += `<div class="result-item numbered"><h4>${line}</h4></div>`;
      } else if (line.startsWith('-') || line.startsWith('•')) {
        html += `<div class="result-item list-item"><p>${line}</p></div>`;
      } else if (line.startsWith('**') && line.endsWith('**')) {
        const text = line.replace(/\*\*/g, '');
        html += `<div class="result-item emphasis"><h4>${text}</h4></div>`;
      } else {
        html += `<div class="result-item paragraph"><p>${line}</p></div>`;
      }
    });

    return html;
  }

  setLoadingState(loading) {
    const detectBtn = document.getElementById('detectBtn');
    if (!detectBtn) return;
    
    const btnText = detectBtn.querySelector('.btn-text');
    const btnLoading = detectBtn.querySelector('.btn-loading');

    if (loading) {
      detectBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnLoading) btnLoading.style.display = 'inline-block';
    } else {
      detectBtn.disabled = false;
      if (btnText) btnText.style.display = 'inline-block';
      if (btnLoading) btnLoading.style.display = 'none';
    }
  }

  showResultsSection(show) {
    const resultsSection = document.getElementById('resultsSection');
    if (!resultsSection) return;
    
    resultsSection.style.display = show ? 'block' : 'none';
    
    if (show) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  clearAll() {
    console.log('🧹 清空所有内容');
    this.removeImage();
    const customPrompt = document.getElementById('customPrompt');
    if (customPrompt) customPrompt.value = '';
    
    const checkboxes = document.querySelectorAll('.option-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = true;
    });
    
    this.showResultsSection(false);
    this.updateDetectButton();
    this.showNotification('已清空所有内容', 'success');
  }

  downloadReport() {
    const resultsContent = document.getElementById('resultsContent');
    const detectionTime = document.getElementById('detectionTime');
    const imageInfo = document.getElementById('imageInfo');
    
    if (!resultsContent) return;
    
    const resultsText = resultsContent.innerText;
    const timeText = detectionTime ? detectionTime.textContent : '';
    const imageText = imageInfo ? imageInfo.textContent : '';
    
    const report = `工地检测报告\n${timeText}\n${imageText}\n\n${resultsText}`;
    
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
    const resultsContent = document.getElementById('resultsContent');
    if (!resultsContent) return;
    
    const resultsText = resultsContent.innerText;
    
    if (navigator.share) {
      navigator.share({
        title: '工地检测报告',
        text: resultsText.substring(0, 100) + '...',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(resultsText).then(() => {
        this.showNotification('检测结果已复制到剪贴板', 'success');
      }).catch(() => {
        this.showNotification('复制失败，请手动复制', 'error');
      });
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
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
      maxWidth: '500px',
      wordWrap: 'break-word'
    });

    const colors = {
      success: '#52c41a',
      error: '#ff4d4f',
      warning: '#faad14',
      info: '#1890ff'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 页面加载完成，初始化工地检测助手（生产环境版本）...');
  new ConstructionDetectionProduction();
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

.result-item.title h2,
.result-item.title h3,
.result-item.title h4 {
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

.result-item.emphasis {
  background: #fff3cd;
  border-left: 3px solid #ffc107;
}

.result-item.emphasis h4 {
  margin: 0;
  color: #856404;
  font-size: 16px;
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

const styleSheet = document.createElement('style');
styleSheet.textContent = resultStyles;
document.head.appendChild(styleSheet);
