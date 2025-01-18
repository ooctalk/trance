import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Redirect, useRouter } from 'expo-router';
import { openDatabaseSync } from 'expo-sqlite';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';

import migrations from '@/drizzle/migrations';

export default function HomeScreen() {
  const expo = openDatabaseSync("trance.db");
  const db = drizzle(expo);
  const { success, error } = useMigrations(db, migrations);
  const router = useRouter();
  const [migrationStatus, setMigrationStatus] = React.useState<
    "loading" | "error" | "success"
  >("loading");

  useEffect(() => {
    if (error) {
      setMigrationStatus("error");
    } else if (success) {
      setMigrationStatus("success");
    }
  }, [success, error, router]);

  if (migrationStatus === "loading") {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Initializing...</Text>
      </View>
    );
  }

  if (migrationStatus === "error") {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Initialization Failure : {error?.message}</Text>
      </View>
    );
  }

  if (migrationStatus === "success") {
    return (
      <Redirect href="/(drawer)/messages" />
    );
  }

  return null;
}
