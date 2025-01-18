import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Storage from 'expo-sqlite/kv-store';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { ArrowRightIcon, CircleIcon, Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import {
    Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader
} from '@/components/ui/modal';
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from '@/components/ui/radio';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import i18n from '@/languages/i18n';

export default function ModelsGeminiScreen() {
  return (
    <View>
      <Stack.Screen options={{ title: "Gemini" }} />
      <VStack className="m-4 gap-y-4">
        <GeminiKey />
        <GeminiModel />
      </VStack>
    </View>
  );
}

function GeminiKey() {
  const [showModal, setShowModal] = useState(false);
  const [key, setKey] = useState("");
  const handleSave = async () => {
    try {
      await SecureStore.setItem("HOME_API_GEMINI_KEY", key);
      setShowModal(false);
    } catch (e) {
      console.log("Error:" + e);
    }
  };
  useEffect(() => {
    (async () => {
      const key = await SecureStore.getItem("HOME_API_GEMINI_KEY");
      key && setKey(key);
    })();
  }, []);
  return (
    <View>
      <Pressable onPress={() => setShowModal(true)}>
        <Card size="md" variant="elevated">
          <HStack className="justify-between items-center">
            <VStack>
              <Heading>{i18n.t("Models.gemini_key")}</Heading>
              <Text>API Key</Text>
            </VStack>
            <Icon as={ArrowRightIcon} />
          </HStack>
        </Card>
      </Pressable>
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
            {i18n.t("Models.gemini_key")}
            </Heading>
          </ModalHeader>
          <ModalBody>
            <Input variant="outline" size="md">
              <InputField
                type="password"
                defaultValue={key}
                onChangeText={(value) => setKey(value)}
                placeholder="Enter Key here..."
              />
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
              <ButtonText>{i18n.t("Cancel")}</ButtonText>
            </Button>
            <Button onPress={() => handleSave()}>
              <ButtonText>{i18n.t("Save")}</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </View>
  );
}

function GeminiModel() {
  const [showModal, setShowModal] = useState(false);
  const [model, setModel] = useState("");
  const handleSave = async () => {
    try {
      await Storage.setItem("HOME_API_GEMINI_MODEL", model);
      setShowModal(false);
    } catch (e) {
      throw e;
    }
  };
  useEffect(() => {
    (async () => {
      try {
        const model = await Storage.getItem("HOME_API_GEMINI_MODEL");
        model && setModel(model);
      } catch (e) {
        throw e;
      }
    })();
  }, []);
  return (
    <View>
      <Pressable onPress={() => setShowModal(true)}>
        <Card size="md" variant="elevated">
          <HStack className="justify-between items-center">
            <VStack>
              <Heading>{i18n.t("Models.gemini_model")}</Heading>
              <Text>Model</Text>
            </VStack>
            <Icon as={ArrowRightIcon} />
          </HStack>
        </Card>
      </Pressable>
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
              {i18n.t("Models.gemini_model")}
            </Heading>
          </ModalHeader>
          <ModalBody>
            <RadioGroup value={model} onChange={(value) => setModel(value)}>
              <Radio value="gemini-1.5-flash" size="md">
                <RadioIndicator>
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
                <RadioLabel>Gemini 1.5 Flash</RadioLabel>
              </Radio>
              <Radio value="gemini-1.5-flash-8b" size="md">
                <RadioIndicator>
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
                <RadioLabel>Gemini 1.5 Flash-8B</RadioLabel>
              </Radio>
              <Radio value="gemini-1.5-pro" size="md">
                <RadioIndicator>
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
                <RadioLabel>Gemini 1.5 Pro</RadioLabel>
              </Radio>
              <Radio value="gemini-2.0-flash-exp" size="md">
                <RadioIndicator>
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
                <RadioLabel>Gemini 2.0 Flash</RadioLabel>
              </Radio>
            </RadioGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText>{i18n.t("Cancel")}</ButtonText>
            </Button>
            <Button onPress={() => handleSave()}>
              <ButtonText>{i18n.t("Save")}</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </View>
  );
}
