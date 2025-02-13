// 定义模型名称
type TModels = 
  "Gemini"

// 模型版本映射
type TModelVersionMap = {
  Gemini: TGeminiModels;
};

/**
 * 定义模型列表
 * model: 指定模型名称
 * version：指定模型版本
 */

type TModelList = {
  model: TModels;
  version: TModelVersionMap[TModels];
};