import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@/components/ui/modal';
import * as SecureStore from 'expo-secure-store';
import { BoltIcon, KeyIcon } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import { toast } from 'sonner-native';

export default function GeminiScreen() {
  return (
    <Box className="m-4">
      <Key />
    </Box>
  );
}

function Key() {
  const [showModal, setShowModal] = React.useState(false);
  const [key, setKey] = React.useState('');

  // 保存key
  const handleSave = async () => {
    try {
      await SecureStore.setItem('TRANCE_GEMINI_API_KEY', key);
      setShowModal(false);
    } catch (e) {
      console.log(e);
      toast.error('保存失败');
    }
  };

  // 初始化key
  useEffect(() => {
    const fetchKey = async () => {
      try {
        const result = await SecureStore.getItem('TRANCE_GEMINI_API_KEY');
        if (!result) return;
        setKey(result);
      } catch (e) {
        console.log(e);
      }
    };
    fetchKey();
  }, [showModal]);

  return (
    <>
      {/* 卡片部分 */}
      <Pressable onPress={() => setShowModal(true)} className="h-24">
        <Card>
          <HStack className="justify-between items-center">
            <HStack space="md" className="items-center">
              <Icon as={KeyIcon} />
              <Heading>密钥</Heading>
            </HStack>
            <Icon as={BoltIcon} />
          </HStack>
        </Card>
      </Pressable>

      {/* 模态框部分 */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md" className="text-typography-950">
              Gemini 密钥
            </Heading>
          </ModalHeader>
          <ModalBody>
            <Input variant="outline" size="md">
              <InputField value={key} onChangeText={setKey} type="password" />
            </Input>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText>取消</ButtonText>
            </Button>
            <Button onPress={handleSave}>
              <ButtonText>保存</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
