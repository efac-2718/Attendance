import { StyleSheet, Text, View } from "react-native";

export default function modules() {
    return(
        <View style={styles.container}>
            <Text>Test</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
})