import React from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from "../utils/Theme";
import {t} from "i18next";

const Loading = ({
    loadingError,
    loadingErrorText = t("loadingError"),
    tapToRetryText = t("tapToRetry"),
    onRetry
  }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity style={[styles.container, {backgroundColor: theme.colors.background}]} onPress={onRetry} disabled={!onRetry}>
      {loadingError ?
        <View>
          <Text style={[styles.error, {color: theme.colors.secondaryText}]}>{loadingErrorText}</Text>
          {onRetry && <Text style={[styles.error, {color: theme.colors.secondaryText}]}>{tapToRetryText}</Text>}
        </View>
      :
        <ActivityIndicator size="large" color={theme.colors.primary}/>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    margin: 10,
    textAlign: 'center',
  },
});

export default Loading;
