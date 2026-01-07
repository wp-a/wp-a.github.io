// 硅基流动 API 客户端
// 国内可用，无需翻墙

class SiliconFlowClient {
    constructor() {
        this.apiKey = null;
        this.baseURL = 'https://api.siliconflow.cn/v1';
    }

    setApiKey(apiKey) {
        this.apiKey = apiKey;
        console.log('✅ 硅基流动 API密钥已设置');
    }

    // 测试连接
    async testConnection() {
        if (!this.apiKey) {
            return { success: false, error: '未设置API密钥' };
        }

        try {
            const response = await fetch(`${this.baseURL}/models`, {
                headers: { 'Authorization': `Bearer ${this.apiKey}` }
            });
            
            if (response.ok) {
                return { success: true, message: '✅ API连接正常' };
            } else {
                return { success: false, error: `API错误: ${response.status}` };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 调用视觉模型分析图片
    async callAPI({ image, prompt, model = 'Qwen/Qwen2.5-VL-32B-Instruct', config = {} }) {
        if (!this.apiKey) {
            throw new Error('请先设置API密钥');
        }

        // 处理图片数据
        const imageUrl = image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`;

        const requestBody = {
            model: model,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: { url: imageUrl }
                        },
                        {
                            type: 'text',
                            text: prompt
                        }
                    ]
                }
            ],
            max_tokens: config.maxOutputTokens || 2000,
            temperature: config.temperature || 0.3
        };

        console.log('📡 调用硅基流动API...', { model });

        try {
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(requestBody)
            });

            console.log('📥 响应状态:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ API错误:', errorData);
                
                if (response.status === 401) {
                    throw new Error('API密钥无效');
                } else if (response.status === 429) {
                    throw new Error('请求过于频繁，请稍后重试');
                } else if (response.status === 400) {
                    throw new Error(errorData.error?.message || '请求格式错误');
                } else {
                    throw new Error(`API错误: ${response.status}`);
                }
            }

            const data = await response.json();
            console.log('✅ API调用成功');

            const result = data.choices?.[0]?.message?.content;
            if (!result) {
                throw new Error('API返回空结果');
            }

            return {
                success: true,
                result: result,
                model: model,
                usage: data.usage
            };

        } catch (error) {
            console.error('❌ 调用失败:', error);
            throw error;
        }
    }
}

// 导出
if (typeof window !== 'undefined') {
    window.SiliconFlowClient = SiliconFlowClient;
}
