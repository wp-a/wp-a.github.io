// 直接调用 Gemini API 的客户端（绕过代理服务器）
// 用于解决 405 错误问题

class GeminiDirectClient {
    constructor() {
        this.apiKey = null;
        this.corsProxies = [
            'https://corsproxy.io/?',
            'https://api.allorigins.win/raw?url=',
            'https://thingproxy.freeboard.io/fetch/',
            'https://proxy.cors.sh/'
        ];
    }

    // 设置 API 密钥
    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }

    // 直接调用 Gemini API
    async callAPI({ image, prompt, model = 'gemini-2.0-flash', config = {} }) {
        if (!this.apiKey) {
            throw new Error('请先设置 API 密钥');
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
        
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
                temperature: 0.7,
                topK: 32,
                topP: 1,
                maxOutputTokens: 2000,
                ...config
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

        // 尝试直接调用
        try {
            const response = await fetch(`${apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`API 请求失败: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (!data.candidates || data.candidates.length === 0) {
                throw new Error('API 返回空结果');
            }

            const result = data.candidates[0].content.parts[0].text;
            if (!result) {
                throw new Error('API 返回空内容');
            }

            return {
                success: true,
                result: result,
                usage: data.usageMetadata || {},
                model: model
            };

        } catch (error) {
            // 如果直接调用失败，尝试使用 CORS 代理
            console.log('直接调用失败，尝试 CORS 代理...');
            return await this.callWithProxy(apiUrl, requestBody, model);
        }
    }

    // 使用 CORS 代理调用
    async callWithProxy(apiUrl, requestBody, model) {
        const errors = [];

        for (const proxy of this.corsProxies) {
            try {
                console.log(`尝试 CORS 代理: ${proxy}`);
                
                let proxyUrl;
                if (proxy.includes('allorigins.win')) {
                    proxyUrl = `${proxy}${encodeURIComponent(`${apiUrl}?key=${this.apiKey}`)}`;
                } else {
                    proxyUrl = `${proxy}${apiUrl}?key=${this.apiKey}`;
                }

                const response = await fetch(proxyUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    throw new Error(`代理请求失败: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                
                if (!data.candidates || data.candidates.length === 0) {
                    throw new Error('API 返回空结果');
                }

                const result = data.candidates[0].content.parts[0].text;
                if (!result) {
                    throw new Error('API 返回空内容');
                }

                return {
                    success: true,
                    result: result,
                    usage: data.usageMetadata || {},
                    model: model,
                    proxy: proxy
                };

            } catch (error) {
                console.error(`代理 ${proxy} 失败:`, error);
                errors.push(`${proxy}: ${error.message}`);
            }
        }

        throw new Error(`所有 CORS 代理都失败:\n${errors.join('\n')}`);
    }

    // 测试 API 连接
    async testConnection() {
        try {
            const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
            
            const result = await this.callAPI({
                image: testImage,
                prompt: '请简单描述这张图片',
                model: 'gemini-2.0-flash'
            });

            return {
                success: true,
                message: 'API 连接正常',
                result: result.result
            };
        } catch (error) {
            return {
                success: false,
                message: 'API 连接失败',
                error: error.message
            };
        }
    }
}

// 导出客户端
if (typeof window !== 'undefined') {
    window.GeminiDirectClient = GeminiDirectClient;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeminiDirectClient;
}
