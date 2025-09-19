// Gemini API 客户端 - 简化版本
// 统一处理所有 API 调用逻辑

class GeminiAPIClient {
    constructor() {
        this.endpoints = this.buildEndpoints();
        this.currentEndpoint = null;
    }

    buildEndpoints() {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const endpoints = [];

        // 根据当前环境添加可用的端点
        if (origin) {
            // Vercel 环境
            endpoints.push(`${origin}/api/gemini-proxy`);
            
            // Netlify 环境
            endpoints.push(`${origin}/.netlify/functions/gemini-proxy`);
            
            // PHP 环境
            endpoints.push(`${origin}/api/gemini-proxy.php`);
        }

        // 本地开发环境
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            endpoints.unshift('http://localhost:3000/api/gemini-proxy');
        }

        return endpoints;
    }

    async callAPI({ image, prompt, model = 'gemini-1.5-flash', config = {} }) {
        const errors = [];
        
        // 尝试每个端点
        for (const endpoint of this.endpoints) {
            try {
                console.log(`尝试 API 端点: ${endpoint}`);
                
                const result = await this.tryEndpoint(endpoint, { image, prompt, model, config });
                
                if (result.success) {
                    this.currentEndpoint = endpoint;
                    console.log(`API 调用成功，使用端点: ${endpoint}`);
                    return result;
                } else {
                    errors.push(`${endpoint}: ${result.error}`);
                }
            } catch (error) {
                console.error(`端点 ${endpoint} 失败:`, error);
                errors.push(`${endpoint}: ${error.message}`);
            }
        }

        // 所有端点都失败
        throw new Error(`所有 API 端点都无法访问:\n${errors.join('\n')}\n\n请检查:\n1. 网络连接\n2. API 密钥配置\n3. 服务器状态`);
    }

    async tryEndpoint(endpoint, { image, prompt, model, config }) {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image,
                prompt,
                model,
                config
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'API 返回失败状态');
        }

        return data;
    }

    // 健康检查
    async healthCheck() {
        const results = [];
        
        for (const endpoint of this.endpoints) {
            try {
                const response = await fetch(endpoint, {
                    method: 'OPTIONS',
                    timeout: 5000
                });
                
                results.push({
                    endpoint,
                    status: response.ok ? 'healthy' : 'unhealthy',
                    statusCode: response.status
                });
            } catch (error) {
                results.push({
                    endpoint,
                    status: 'error',
                    error: error.message
                });
            }
        }
        
        return results;
    }

    // 获取当前使用的端点
    getCurrentEndpoint() {
        return this.currentEndpoint;
    }

    // 获取所有端点
    getAllEndpoints() {
        return this.endpoints;
    }
}

// 导出客户端
if (typeof window !== 'undefined') {
    window.GeminiAPIClient = GeminiAPIClient;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeminiAPIClient;
}
