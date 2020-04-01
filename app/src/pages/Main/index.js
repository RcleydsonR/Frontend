import React from "react";
import { View, Text, Image } from "react-native";
import styles from "./styles";
import Container from "../../components/Container";

export default function Main() {
  return (
    <Container style={styles.container}>
      <Text style={styles.text1}>Projeto Mia Ajuda em Ação em h1</Text>
      <Text style={styles.text2}>Projeto Mia Ajuda em Ação em h2</Text>
      <Text style={styles.text3}>Projeto Mia Ajuda em Ação em p</Text>
    </Container>
  );
}
