// Gemini API 连接修复版本
// 解决连接不上服务器的问题

class GeminiAPIFix {
    constructor() {
        this.apiKey = null;
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
    }

    setApiKey(apiKey) {
        this.apiKey = apiKey;
        console.log('✅ API密钥已设置');
    }

    // 测试API连接
    async testConnection() {
        console.log('🔍 开始测试API连接...');
        
        if (!this.apiKey) {
            return {
                success: false,
                error: '❌ 未设置API密钥'
            };
        }

        try {
            // 使用简单的文本测试（不需要图片）
            const testURL = `${this.baseURL}/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;
            
            console.log('📡 发送测试请求...');
            
            const response = await fetch(testURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: '你好' }]
                    }]
                })
            });

            console.log('📥 收到响应:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API错误:', errorText);
                
                if (response.status === 400) {
                    return { success: false, error: '❌ API密钥格式错误或无效' };
                } else if (response.status === 403) {
                    return { success: false, error: '❌ API密钥无权限，请检查是否启用了Gemini API' };
                } else if (response.status === 429) {
                    return { success: false, error: '❌ API配额已用完，请稍后重试' };
                } else {
                    return { success: false, error: `❌ API错误: ${response.status}` };
                }
            }

            const data = await response.json();
            console.log('✅ API连接成功!', data);

            return {
                success: true,
                message: '✅ API连接正常',
                data: data
            };

        } catch (error) {
            console.error('❌ 连接失败:', error);
            
            if (error.message.includes('Failed to fetch')) {
                return {
                    success: false,
                    error: '❌ 网络连接失败，可能原因：\n1. 网络不稳定\n2. 被防火墙拦截\n3. 需要使用VPN'
                };
            }
            
            return {
                success: false,
                error: `❌ 连接错误: ${error.message}`
            };
        }
    }

    // 改进的API调用方法
    async callAPI({ image, prompt, model = 'gemini-2.0-flash', config = {} }) {
        if (!this.apiKey) {
            throw new Error('请先设置API密钥');
        }

        const apiUrl = `${this.baseURL}/models/${model}:generateContent?key=${this.apiKey}`;
        
        // 处理图片数据
        const imageData = image.startsWith('data:') ? image.split(',')[1] : image;
        const mimeType = image.startsWith('data:') ? 
            (image.match(/data:([^;]+)/)?.[1] || 'image/jpeg') : 'image/jpeg';

        const requestBody = {
            contents: [{
                parts: [
                    { text: prompt },
                    {
                        inline_data: {
                            mime_type: mimeType,
                            data: imageData
                        }
                    }
                ]
            }],
            generationConfig: {
                temperature: config.temperature || 0.3,
                maxOutputTokens: config.maxOutputTokens || 2000,
            }
        };

        console.log('📡 发送API请求...', { model, promptLength: prompt.length });

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            console.log('📥 收到响应:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API错误响应:', errorText);
                
                // 详细的错误处理
                if (response.status === 400) {
                    throw new Error('请求格式错误，请检查图片格式');
                } else if (response.status === 403) {
                    throw new Error('API密钥无权限或已过期');
                } else if (response.status === 429) {
                    throw new Error('API调用次数超限，请稍后重试');
                } else if (response.status === 500) {
                    throw new Error('服务器错误，请稍后重试');
                } else {
                    throw new Error(`API错误: ${response.status} ${response.statusText}`);
                }
            }

            const data = await response.json();
            console.log('✅ API调用成功');

            if (!data.candidates || data.candidates.length === 0) {
                throw new Error('API返回空结果，可能图片内容被过滤');
            }

            const result = data.candidates[0].content.parts[0].text;
            
            return {
                success: true,
                result: result,
                model: model
            };

        } catch (error) {
            console.error('❌ API调用失败:', error);
            throw error;
        }
    }
}

// 导出
if (typeof window !== 'undefined') {
    window.GeminiAPIFix = GeminiAPIFix;
}
