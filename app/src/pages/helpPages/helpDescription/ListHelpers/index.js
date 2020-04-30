import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";

import styles from "./styles";

export default function ListHelpers({ clickAction, stateAction }) {
  return (
    <View
      style={[
        styles.container,
        stateAction
          ? { justifyContent: "flex-start" }
          : { justifyContent: "flex-end" }
      ]}
    >
      <TouchableOpacity
        style={styles.buttonHelpers}
        onPress={() => clickAction(!stateAction)}
      >
        <Text style={styles.textBtn}>Possíveis ajudantes</Text>
      </TouchableOpacity>
      {stateAction ? (
        <View style={styles.listPossibleHelpers}>
          <ScrollView>
            <TouchableOpacity>
              <View style={styles.helper}>
                <Image
                  style={styles.imageProfile}
                  source={{
                    uri:
                      "https://s3.amazonaws.com/uifaces/faces/twitter/jonathansimmons/128.jpg"
                  }}
                />
                <View>
                  <Text
                    style={[
                      styles.infoText,
                      { fontFamily: "montserrat-semibold" }
                    ]}
                  >
                    Jobs
                  </Text>
                  <Text>
                    <Text
                      style={[
                        styles.infoText,
                        { fontFamily: "montserrat-semibold" }
                      ]}
                    >
                      Idade:{" "}
                    </Text>
                    151
                  </Text>
                  <Text>
                    <Text
                      style={[
                        styles.infoText,
                        { fontFamily: "montserrat-semibold" }
                      ]}
                    >
                      Cidade:{" "}
                    </Text>
                    dadsadsa
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
}
