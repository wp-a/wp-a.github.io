// 工地检测助手 - 改进版本
// 解决API调用、文件上传和CORS问题

class ConstructionDetectionImproved {
    constructor() {
        // 配置信息
        this.config = {
            // 多个API后端选项（按运行环境动态生成）
            apiEndpoints: this.buildApiEndpoints(),
            maxFileSize: 10 * 1024 * 1024, // 10MB
            supportedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
            compressionQuality: 0.8,
            maxImageDimension: 2048
        };
        
        this.state = {
            currentImage: null,
            isDetecting: false,
            lastResults: null
        };
        
        this.init();
    }

    buildApiEndpoints() {
        const endpoints = [];
        const origin = typeof window !== 'undefined' ? window.location.origin : '';

        // 优先使用同源（适用于 Vercel 等平台：/api/gemini-proxy 存在）
        if (origin) {
            endpoints.push(`${origin}/api/gemini-proxy`);
        } else {
            endpoints.push('/api/gemini-proxy');
        }

        // Netlify Functions（若在 Netlify 上）
        endpoints.push(`${origin}/.netlify/functions/gemini-proxy`);

        // 传统主机 PHP 代理（若服务器支持 PHP）
        if (origin) {
            endpoints.push(`${origin}/api/gemini-proxy.php`);
        } else {
            endpoints.push('/api/gemini-proxy.php');
        }

        // 仅在本地预览时才加入本地 Node 后端
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            endpoints.unshift('http://localhost:3000/api/gemini-proxy');
        }

        // 去重
        return Array.from(new Set(endpoints));
    }

    init() {
        console.log('工地检测助手初始化中...');
        this.setupEventListeners();
        this.setupDragDropZone();
        this.loadUserPreferences();
        this.checkApiAvailability();
        console.log('初始化完成');
    }

    setupEventListeners() {
        // 获取DOM元素
        this.elements = {
            uploadArea: document.getElementById('uploadArea'),
            imageInput: document.getElementById('imageInput'),
            imagePreview: document.getElementById('imagePreview'),
            previewImg: document.getElementById('previewImg'),
            removeBtn: document.getElementById('removeBtn'),
            detectBtn: document.getElementById('detectBtn'),
            clearBtn: document.getElementById('clearBtn'),
            customPrompt: document.getElementById('customPrompt'),
            resultsSection: document.getElementById('resultsSection'),
            resultsContent: document.getElementById('resultsContent'),
            detectionTime: document.getElementById('detectionTime'),
            imageInfo: document.getElementById('imageInfo'),
            downloadBtn: document.getElementById('downloadBtn'),
            shareBtn: document.getElementById('shareBtn')
        };

        // 检查必需元素
        const required = ['uploadArea', 'imageInput', 'detectBtn'];
        for (const key of required) {
            if (!this.elements[key]) {
                console.error(`找不到必需元素: ${key}`);
                this.showNotification(`页面元素缺失: ${key}`, 'error');
                return;
            }
        }

        // 绑定事件
        this.elements.uploadArea.addEventListener('click', () => {
            this.elements.imageInput.click();
        });

        this.elements.imageInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0]);
        });

        this.elements.removeBtn?.addEventListener('click', () => {
            this.removeImage();
        });

        this.elements.detectBtn.addEventListener('click', () => {
            this.startDetection();
        });

        this.elements.clearBtn?.addEventListener('click', () => {
            this.clearAll();
        });

        this.elements.downloadBtn?.addEventListener('click', () => {
            this.downloadReport();
        });

        this.elements.shareBtn?.addEventListener('click', () => {
            this.shareResults();
        });

        // 检测选项变化监听
        const checkboxes = document.querySelectorAll('.option-item input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateDetectButton();
                this.saveUserPreferences();
            });
        });
    }

    setupDragDropZone() {
        const uploadArea = this.elements.uploadArea;
        if (!uploadArea) return;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.remove('dragover');
            });
        });

        uploadArea.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelect(files[0]);
            }
        });
    }

    async handleFileSelect(file) {
        if (!file) {
            console.log('没有选择文件');
            return;
        }

        console.log('处理文件:', { 
            name: file.name, 
            type: file.type, 
            size: file.size 
        });

        // 验证文件
        const validation = this.validateFile(file);
        if (!validation.valid) {
            this.showNotification(validation.message, 'error');
            return;
        }

        try {
            // 显示加载状态
            this.showNotification('正在处理图片...', 'info');
            
            // 压缩图片（如果需要）
            const processedFile = await this.processImage(file);
            
            // 存储文件
            this.state.currentImage = processedFile;
            
            // 显示预览
            await this.displayImagePreview(processedFile);
            
            // 更新按钮状态
            this.updateDetectButton();
            
            this.showNotification('图片上传成功', 'success');
            
        } catch (error) {
            console.error('文件处理失败:', error);
            this.showNotification('图片处理失败，请重试', 'error');
        }
    }

    validateFile(file) {
        // 检查文件类型
        if (!this.config.supportedTypes.includes(file.type)) {
            return {
                valid: false,
                message: `不支持的文件类型。支持: ${this.config.supportedTypes.join(', ')}`
            };
        }

        // 检查文件大小
        if (file.size > this.config.maxFileSize) {
            const maxSizeMB = (this.config.maxFileSize / 1024 / 1024).toFixed(1);
            return {
                valid: false,
                message: `文件大小不能超过 ${maxSizeMB}MB`
            };
        }

        return { valid: true };
    }

    async processImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            img.onload = () => {
                try {
                    // 计算压缩后的尺寸
                    let { width, height } = this.calculateImageDimensions(
                        img.width, 
                        img.height, 
                        this.config.maxImageDimension
                    );

                    // 设置画布尺寸
                    canvas.width = width;
                    canvas.height = height;

                    // 绘制图片
                    ctx.drawImage(img, 0, 0, width, height);

                    // 转换为Blob
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                // 创建新的File对象
                                const processedFile = new File([blob], file.name, {
                                    type: file.type,
                                    lastModified: Date.now()
                                });
                                resolve(processedFile);
                            } else {
                                reject(new Error('图片压缩失败'));
                            }
                        },
                        file.type,
                        this.config.compressionQuality
                    );
                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = () => {
                reject(new Error('图片加载失败'));
            };

            img.src = URL.createObjectURL(file);
        });
    }

    calculateImageDimensions(originalWidth, originalHeight, maxDimension) {
        if (originalWidth <= maxDimension && originalHeight <= maxDimension) {
            return { width: originalWidth, height: originalHeight };
        }

        const ratio = Math.min(
            maxDimension / originalWidth,
            maxDimension / originalHeight
        );

        return {
            width: Math.round(originalWidth * ratio),
            height: Math.round(originalHeight * ratio)
        };
    }

    async displayImagePreview(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                if (this.elements.previewImg && this.elements.imagePreview) {
                    this.elements.previewImg.src = e.target.result;
                    this.elements.imagePreview.style.display = 'block';
                    this.elements.uploadArea.style.display = 'none';
                }
                resolve();
            };
            
            reader.onerror = () => {
                reject(new Error('图片预览失败'));
            };
            
            reader.readAsDataURL(file);
        });
    }

    removeImage() {
        this.state.currentImage = null;
        
        if (this.elements.imagePreview && this.elements.uploadArea) {
            this.elements.imagePreview.style.display = 'none';
            this.elements.uploadArea.style.display = 'block';
        }
        
        if (this.elements.imageInput) {
            this.elements.imageInput.value = '';
        }
        
        this.updateDetectButton();
        this.showNotification('图片已移除', 'info');
    }

    updateDetectButton() {
        const hasImage = !!this.state.currentImage;
        const hasSelectedOptions = this.getSelectedOptions().length > 0;
        
        if (this.elements.detectBtn) {
            this.elements.detectBtn.disabled = !(hasImage && hasSelectedOptions) || this.state.isDetecting;
        }
    }

    getSelectedOptions() {
        const checkboxes = document.querySelectorAll('.option-item input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    async startDetection() {
        if (!this.state.currentImage) {
            this.showNotification('请先上传图片', 'error');
            return;
        }

        const selectedOptions = this.getSelectedOptions();
        if (selectedOptions.length === 0) {
            this.showNotification('请至少选择一种检测类型', 'error');
            return;
        }

        // 设置检测状态
        this.state.isDetecting = true;
        this.setLoadingState(true);
        this.showResultsSection(false);

        try {
            // 准备请求数据
            const imageBase64 = await this.fileToBase64(this.state.currentImage);
            const customPrompt = this.elements.customPrompt?.value.trim() || '';
            const detectionPrompt = this.buildDetectionPrompt(selectedOptions, customPrompt);

            // 调用API
            const result = await this.callDetectionApi(imageBase64, detectionPrompt);

            // 显示结果
            this.displayResults(result);
            this.showResultsSection(true);
            this.state.lastResults = result;

            this.showNotification('检测完成', 'success');

        } catch (error) {
            console.error('检测失败:', error);
            this.showError(error.message);
        } finally {
            this.state.isDetecting = false;
            this.setLoadingState(false);
        }
    }

    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    buildDetectionPrompt(selectedOptions, customPrompt) {
        const optionNames = {
            'safety': '安全检测 - 识别安全隐患、违规操作、防护设备佩戴情况',
            'progress': '进度监控 - 评估施工进度、质量状况、完工程度',
            'equipment': '设备检查 - 检测机械设备状态、工具摆放、设备安全',
            'personnel': '人员管理 - 分析人员配置、安全装备、作业规范',
            'environment': '环境评估 - 检查现场环境、清洁度、周边安全'
        };

        let prompt = `作为专业的建筑工程安全检测专家，请对这张工地图片进行全面分析。

重点检测内容：
${selectedOptions.map(option => `• ${optionNames[option] || option}`).join('\n')}

${customPrompt ? `\n特别关注事项：\n${customPrompt}` : ''}

请按以下结构提供专业分析报告：

## 1. 总体评估
- 工地整体安全状况
- 主要风险等级评估

## 2. 详细发现
- 安全隐患识别
- 违规操作发现
- 设备状态评估
- 人员配置分析

## 3. 问题分类
- 高风险问题（需立即整改）
- 中风险问题（需尽快处理）
- 低风险问题（建议改进）

## 4. 改进建议
- 具体整改措施
- 预防措施建议
- 管理流程优化

## 5. 合规性检查
- 相关标准符合情况
- 法规要求对照

请确保分析准确、专业，并提供可操作的具体建议。`;

        return prompt;
    }

    async callDetectionApi(imageBase64, prompt) {
        const errors = [];
        
        // 尝试多个API端点
        for (const endpoint of this.config.apiEndpoints) {
            try {
                console.log(`尝试API端点: ${endpoint}`);
                
                const result = await this.tryApiEndpoint(endpoint, imageBase64, prompt);
                if (result) {
                    return result;
                }
            } catch (error) {
                console.error(`API端点失败 ${endpoint}:`, error);
                errors.push(`${endpoint}: ${error.message}`);
            }
        }

        // 所有端点都失败，抛出错误
        throw new Error(`所有API端点都无法访问:\n${errors.join('\n')}\n\n解决方案:\n1. 检查网络连接\n2. 配置后端API代理\n3. 联系系统管理员`);
    }

    async tryApiEndpoint(endpoint, imageBase64, prompt) {
        // 根据不同的端点类型构建请求
        if (endpoint.includes('gemini-proxy')) {
            return await this.callGeminiProxy(endpoint, imageBase64, prompt);
        } else {
            return await this.callCustomApi(endpoint, imageBase64, prompt);
        }
    }

    async callGeminiProxy(endpoint, imageBase64, prompt) {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: imageBase64,
                prompt: prompt,
                model: 'gemini-1.5-flash'
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`代理服务器错误: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data.result || data.response || data.text;
    }

    async callOpenAiApi(endpoint, imageBase64, prompt) {
        // 注意：这需要配置OpenAI API密钥
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY || 'your-api-key'}`
            },
            body: JSON.stringify({
                model: 'gpt-4-vision-preview',
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: prompt },
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
            throw new Error(`OpenAI API错误: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async callCustomApi(endpoint, imageBase64, prompt) {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: imageBase64,
                prompt: prompt
            })
        });

        if (!response.ok) {
            throw new Error(`自定义API错误: ${response.status}`);
        }

        const data = await response.json();
        return data.result || data.response;
    }

    displayResults(result) {
        if (!this.elements.resultsContent) return;

        // 格式化结果
        const formattedResult = this.formatResult(result);
        this.elements.resultsContent.innerHTML = formattedResult;

        // 更新元数据
        if (this.elements.detectionTime) {
            this.elements.detectionTime.textContent = `检测时间: ${new Date().toLocaleString('zh-CN')}`;
        }

        if (this.elements.imageInfo && this.state.currentImage) {
            const sizeMB = (this.state.currentImage.size / 1024 / 1024).toFixed(2);
            this.elements.imageInfo.textContent = `图片信息: ${this.state.currentImage.name} (${sizeMB}MB)`;
        }
    }

    formatResult(result) {
        // 将Markdown格式转换为HTML
        let html = result
            .replace(/## (.*)/g, '<h3 class="result-section-title">$1<\/h3>')
            .replace(/### (.*)/g, '<h4 class="result-subsection-title">$1<\/h4>')
            .replace(/^\- (.*)/gm, '<li class="result-list-item">$1<\/li>')
            .replace(/^\* (.*)/gm, '<li class="result-list-item">$1<\/li>')
            .replace(/^\d+\. (.*)/gm, '<li class="result-numbered-item">$1<\/li>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1<\/strong>')
            .replace(/\*(.*?)\*/g, '<em>$1<\/em>');

        // 处理列表
        html = html.replace(/(<li class="result-list-item">.*<\/li>)/gs, '<ul class="result-list">$1<\/ul>');
        html = html.replace(/(<li class="result-numbered-item">.*<\/li>)/gs, '<ol class="result-numbered-list">$1<\/ol>');

        // 处理段落
        html = html.split('\n\n').map(paragraph => {
            if (paragraph.trim() && !paragraph.includes('<h') && !paragraph.includes('<ul') && !paragraph.includes('<ol')) {
                return `<p class="result-paragraph">${paragraph.trim()}<\/p>`;
            }
            return paragraph;
        }).join('\n');

        return html;
    }

    setLoadingState(loading) {
        if (!this.elements.detectBtn) return;

        const btnText = this.elements.detectBtn.querySelector('.btn-text');
        const btnLoading = this.elements.detectBtn.querySelector('.btn-loading');

        if (loading) {
            this.elements.detectBtn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'inline-block';
        } else {
            this.elements.detectBtn.disabled = false;
            if (btnText) btnText.style.display = 'inline';
            if (btnLoading) btnLoading.style.display = 'none';
        }
    }

    showResultsSection(show) {
        if (this.elements.resultsSection) {
            this.elements.resultsSection.style.display = show ? 'block' : 'none';
            if (show) {
                this.elements.resultsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    showError(message) {
        if (!this.elements.resultsContent) return;

        this.elements.resultsContent.innerHTML = `
            <div class="error-container">
                <div class="error-icon">⚠️</div>
                <div class="error-content">
                    <h3>检测失败</h3>
                    <p class="error-message">${message}</p>
                    <div class="error-solutions">
                        <h4>可能的解决方案：</h4>
                        <ul>
                            <li>检查网络连接是否正常</li>
                            <li>确认API服务是否可用</li>
                            <li>尝试重新上传图片</li>
                            <li>联系技术支持</li>
                        </ul>
                    </div>
                    <button class="retry-btn" onclick="window.constructionDetector.startDetection()">
                        重试检测
                    </button>
                </div>
            </div>
        `;

        this.showResultsSection(true);
    }

    clearAll() {
        this.removeImage();
        
        if (this.elements.customPrompt) {
            this.elements.customPrompt.value = '';
        }

        // 重置所有选项为选中
        const checkboxes = document.querySelectorAll('.option-item input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
        });

        this.showResultsSection(false);
        this.state.lastResults = null;
        this.updateDetectButton();
        this.showNotification('已清空所有内容', 'success');
    }

    downloadReport() {
        if (!this.state.lastResults) {
            this.showNotification('没有可下载的报告', 'error');
            return;
        }

        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
        const filename = `工地检测报告_${timestamp}.txt`;
        
        const content = `工地检测报告
生成时间: ${new Date().toLocaleString('zh-CN')}
图片信息: ${this.state.currentImage?.name || '未知'}

${this.state.lastResults}`;

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('报告已下载', 'success');
    }

    shareResults() {
        if (!this.state.lastResults) {
            this.showNotification('没有可分享的结果', 'error');
            return;
        }

        const shareData = {
            title: '工地检测报告',
            text: this.state.lastResults.substring(0, 200) + '...',
            url: window.location.href
        };

        if (navigator.share && navigator.canShare(shareData)) {
            navigator.share(shareData);
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(this.state.lastResults).then(() => {
                this.showNotification('检测结果已复制到剪贴板', 'success');
            }).catch(() => {
                this.showNotification('复制失败，请手动选择复制', 'error');
            });
        } else {
            this.showNotification('您的浏览器不支持分享功能', 'error');
        }
    }

    async checkApiAvailability() {
        // 检查API可用性
        console.log('检查API可用性...');
        
        // 这里可以添加简单的健康检查
        for (const endpoint of this.config.apiEndpoints) {
            try {
                if (endpoint.startsWith('http') && !endpoint.includes('openai.com')) {
                    const response = await fetch(endpoint.replace(/\/[^\/]*$/, '/health'), {
                        method: 'GET',
                        timeout: 5000
                    }).catch(() => null);
                    
                    if (response?.ok) {
                        console.log(`API端点可用: ${endpoint}`);
                        return;
                    }
                }
            } catch (error) {
                // 静默处理检查失败
            }
        }
    }

    showNotification(message, type = 'info', duration = 3000) {
        // 移除现有通知
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // 样式
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 16px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease',
            maxWidth: '400px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            backgroundColor: this.getNotificationColor(type)
        });

        document.body.appendChild(notification);

        // 显示动画
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });

        // 关闭按钮事件
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.hideNotification(notification);
        });

        // 自动隐藏
        if (duration > 0) {
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    this.hideNotification(notification);
                }
            }, duration);
        }
    }

    hideNotification(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }

    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            success: '#52c41a',
            error: '#ff4d4f', 
            warning: '#faad14',
            info: '#1890ff'
        };
        return colors[type] || colors.info;
    }

    loadUserPreferences() {
        try {
            const saved = localStorage.getItem('construction-detection-preferences');
            if (saved) {
                const preferences = JSON.parse(saved);
                
                // 恢复检测选项
                if (preferences.detectionOptions) {
                    Object.entries(preferences.detectionOptions).forEach(([key, checked]) => {
                        const checkbox = document.querySelector(`input[value="${key}"]`);
                        if (checkbox) {
                            checkbox.checked = checked;
                        }
                    });
                }

                // 恢复自定义提示
                if (preferences.customPrompt && this.elements.customPrompt) {
                    this.elements.customPrompt.value = preferences.customPrompt;
                }
            }
        } catch (error) {
            console.warn('加载用户偏好失败:', error);
        }
    }

    saveUserPreferences() {
        try {
            const preferences = {
                detectionOptions: {},
                customPrompt: this.elements.customPrompt?.value || '',
                lastSaved: new Date().toISOString()
            };

            // 保存检测选项
            const checkboxes = document.querySelectorAll('.option-item input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                preferences.detectionOptions[checkbox.value] = checkbox.checked;
            });

            localStorage.setItem('construction-detection-preferences', JSON.stringify(preferences));
        } catch (error) {
            console.warn('保存用户偏好失败:', error);
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.constructionDetector = new ConstructionDetectionImproved();
});

// 添加样式
const additionalStyles = `
.notification {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 8px;
}

.notification-close {
    background: none;
    border: none;
    color: inherit;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    margin-left: auto;
    opacity: 0.8;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.notification-close:hover {
    opacity: 1;
}

.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
    text-align: center;
    background: #fff5f5;
    border-radius: 12px;
    border: 1px solid #fed7d7;
}

.error-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.error-content h3 {
    color: #e53e3e;
    margin-bottom: 12px;
}

.error-message {
    color: #c53030;
    margin-bottom: 20px;
    line-height: 1.5;
}

.error-solutions {
    background: #f7fafc;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    text-align: left;
}

.error-solutions h4 {
    color: #4a5568;
    margin-bottom: 8px;
}

.error-solutions ul {
    color: #718096;
    margin: 0;
    padding-left: 20px;
}

.retry-btn {
    background: #e53e3e;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
}

.retry-btn:hover {
    background: #c53030;
}

.result-section-title {
    color: #2b6cb0;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 8px;
    margin: 20px 0 16px 0;
}

.result-subsection-title {
    color: #4a5568;
    margin: 16px 0 8px 0;
}

.result-list, .result-numbered-list {
    margin: 12px 0;
    padding-left: 20px;
}

.result-list-item, .result-numbered-item {
    margin: 6px 0;
    line-height: 1.5;
}

.result-paragraph {
    margin: 12px 0;
    line-height: 1.6;
    color: #4a5568;
}

[data-theme="dark"] .error-container {
    background: #2d1b1b;
    border-color: #4a2c2c;
}

[data-theme="dark"] .error-content h3 {
    color: #fc8181;
}

[data-theme="dark"] .error-message {
    color: #f56565;
}

[data-theme="dark"] .error-solutions {
    background: #2d3748;
}
`;

// 注入样式
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);


