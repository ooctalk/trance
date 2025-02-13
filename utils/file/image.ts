import * as ImagePicker from 'expo-image-picker';
/**
 * 选择角色卡封面
 * @returns 图片地址
 */
export async function selectCharacterCover() {
  try {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      return result.assets[0]
    }
  } catch (e) {
    console.log(e);
  }
}
