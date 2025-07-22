import { useAppStore } from "@/context/appStore";
import { useOfflineStore } from "@/context/offlineStore";
import { baseUrl } from "@/services/base";
import { AddInUseTable } from "@/services/table";
import { getCurrentPakistaniTime } from "@/services/utilities/getPakistaniTime";
import { getRandomId } from "@/services/utilities/getRandomId";
import { isInternetConnected } from "@/services/utilities/isInternetConnected";
import Checkbox from "expo-checkbox";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
export default function Assign() {
  const params = useLocalSearchParams();
  const tables = useAppStore((state) => state.tables);
  const customers = useAppStore((state) => state.customers);
  const setCustomerOffline = useAppStore((state) => state.setCustomerOffline);
  const setCustomerOnline = useAppStore((state) => state.setCustomerOnline);

  const user = useAppStore((state) => state.user);
  const setInUseTables = useAppStore((state) => state.setInUseTables);
  const { table_id } = params;
  const table = tables.filter((item) => item._id == table_id)[0];
  const [isChecked, setChecked] = useState(true);
  const [matchInfo, setMatchInfo] = useState({
    player_name1: "",
    player_name2: "",
    player_name3: "",
    player_name4: "",
    game_mode: "1 v 1",
    game_type: "One Red",
    friendly_match: true,
    table,
    _id: getRandomId(),
    created_by: user?._id,
    date: getCurrentPakistaniTime(),
  });

  const [isDisabled, setIsDisabled] = useState(true);

  const handleChange = (field: string, value: string | boolean) => {
    setMatchInfo({ ...matchInfo, [field]: value });
  };

  useEffect(() => {
    if (matchInfo.game_mode == "1 v 1" && matchInfo.friendly_match) {
      if (matchInfo.player_name1) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    }
    if (matchInfo.game_mode == "1 v 1" && !matchInfo.friendly_match) {
      if (matchInfo.player_name1 && matchInfo.player_name2) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    }
    if (matchInfo.game_mode == "2 v 2" && matchInfo.friendly_match) {
      if (matchInfo.player_name1 && matchInfo.player_name2) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    }
    if (matchInfo.game_mode == "2 v 2" && !matchInfo.friendly_match) {
      if (
        matchInfo.player_name1 &&
        matchInfo.player_name2 &&
        matchInfo.player_name3 &&
        matchInfo.player_name4
      ) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    }
  }, [matchInfo]);

  const addToQueue = useOfflineStore((state) => state.addToQueue);

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);

      const isConnected = await isInternetConnected();
      const currentTime = getCurrentPakistaniTime();

      const players = [
        matchInfo.player_name1,
        matchInfo.player_name2,
        matchInfo.player_name3,
        matchInfo.player_name4,
      ].filter(Boolean); // Remove empty/undefined names

      const addCustomer = (
        name: string,
        action: typeof setCustomerOnline | typeof setCustomerOffline
      ) => {
        action({ name, date: currentTime, _id: getRandomId() });
      };

      if (isConnected) {
        players.forEach((name) => addCustomer(name, setCustomerOnline));
        await AddInUseTable(matchInfo);
      } else {
        players.forEach((name) => addCustomer(name, setCustomerOffline));
        addToQueue({
          method: "POST",
          url: baseUrl + "/table/in-use",
          body: matchInfo,
          id: getRandomId(),
        });
      }

      setInUseTables(matchInfo);

      setMatchInfo({
        player_name1: "",
        player_name2: "",
        player_name3: "",
        player_name4: "",
        game_mode: "1 v 1",
        game_type: "One Red",
        friendly_match: true,
        table,
        _id: getRandomId(),
        created_by: "",
        date: "",
      });

      setIsLoading(false);
      ToastAndroid.showWithGravity(
        "Match Started",
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
      return router.replace("/(tabs)");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <View style={styles.conatiner}>
      <View style={{ marginHorizontal: 25 }}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Player 1 Name *</Text>
          <TextInput
            placeholder="Enter Player Name"
            style={styles.input}
            value={matchInfo.player_name1}
            onChangeText={(e) => handleChange("player_name1", e)}
            placeholderTextColor={"black"}
          />
        </View>
        {matchInfo.game_mode == "1 v 1" && !isChecked && (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Player 2 Name </Text>
            <TextInput
              placeholder="Enter Player Name"
              placeholderTextColor={"black"}
              style={styles.input}
              value={matchInfo.player_name2}
              onChangeText={(e) => handleChange("player_name2", e)}
            />
          </View>
        )}
        {matchInfo.game_mode == "2 v 2" && isChecked && (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Player 2 Name </Text>
            <TextInput
              placeholder="Enter Player Name"
              placeholderTextColor={"black"}
              style={styles.input}
              value={matchInfo.player_name2}
              onChangeText={(e) => handleChange("player_name2", e)}
            />
          </View>
        )}
        {matchInfo.game_mode == "2 v 2" && !isChecked && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Player 2 Name </Text>
              <TextInput
                placeholder="Enter Player Name"
                placeholderTextColor={"black"}
                style={styles.input}
                value={matchInfo.player_name2}
                onChangeText={(e) => handleChange("player_name2", e)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Player 3 Name </Text>
              <TextInput
                placeholder="Enter Player Name"
                placeholderTextColor={"black"}
                style={styles.input}
                value={matchInfo.player_name3}
                onChangeText={(e) => handleChange("player_name3", e)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Player 4 Name </Text>
              <TextInput
                placeholder="Enter Player Name"
                placeholderTextColor={"black"}
                style={styles.input}
                value={matchInfo.player_name4}
                onChangeText={(e) => handleChange("player_name4", e)}
              />
            </View>
          </>
        )}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 13,
          }}
        >
          {/* <Text style={styles.inputLabel}></Text> */}
          <Checkbox
            value={isChecked}
            color={"#475ba3"}
            onValueChange={(e) => {
              setChecked(e);
              handleChange("friendly_match", e);
            }}
          />
          <Text style={{ fontSize: 16, marginLeft: 8 }}>Friendly Match</Text>
        </View>

        <View style={{ marginTop: 15 }}>
          <Text style={styles.inputLabel}>Mode</Text>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.pill,
                matchInfo.game_mode === "1 v 1" && styles.pillSelected,
              ]}
              onPress={() => setMatchInfo({ ...matchInfo, game_mode: "1 v 1" })}
            >
              <Text style={styles.pillText}>1 v 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pill,
                matchInfo.game_mode === "2 v 2" && styles.pillSelected,
              ]}
              onPress={() => {
                setMatchInfo({ ...matchInfo, game_mode: "2 v 2" });
              }}
            >
              <Text style={styles.pillText}>2 v 2</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginTop: 15 }}>
          <Text style={styles.inputLabel}>Game Type</Text>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.pill,
                matchInfo.game_type === "One Red" && styles.pillSelected,
              ]}
              onPress={() =>
                setMatchInfo({ ...matchInfo, game_type: "One Red" })
              }
            >
              <Text style={styles.pillText}>One Red</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pill,
                matchInfo.game_type === "Six Red" && styles.pillSelected,
              ]}
              onPress={() => {
                setMatchInfo({ ...matchInfo, game_type: "Six Red" });
              }}
            >
              <Text style={styles.pillText}>Six Red</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pill,
                matchInfo.game_type === "Ten Red" && styles.pillSelected,
              ]}
              onPress={() => {
                setMatchInfo({ ...matchInfo, game_type: "Ten Red" });
              }}
            >
              <Text style={styles.pillText}>Ten Red</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pill,
                matchInfo.game_type === "Fifteen Red" && styles.pillSelected,
              ]}
              onPress={() => {
                setMatchInfo({ ...matchInfo, game_type: "Fifteen Red" });
              }}
            >
              <Text style={styles.pillText}>Fifteen Red</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pill,
                matchInfo.game_type === "Century" && styles.pillSelected,
              ]}
              onPress={() => {
                setMatchInfo({ ...matchInfo, game_type: "Century" });
              }}
            >
              <Text style={styles.pillText}>Century</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[isDisabled || isLoading ? styles.btnDisabled : styles.btn]}
        >
          <TouchableOpacity
            onPress={handleClick}
            disabled={isDisabled || isLoading}
          >
            <Text
              style={{ textAlign: "center", color: "#fefefe", fontSize: 16 }}
            >
              {isLoading ? (
                <ActivityIndicator color={"#fefe"} />
              ) : (
                "Start Match"
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    backgroundColor: "#f4f5f9",
    height: "100%",
  },
  inputContainer: {
    marginTop: 13,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    height: 40,
    backgroundColor: "#fefefe",
    // marginVertical: 10,
    borderRadius: 7,
    paddingHorizontal: 10,
    fontSize: 14,
    borderColor: "#eeeff3",
    borderWidth: 1,
    color: "black",
  },
  tabContainer: {
    display: "flex",
    backgroundColor: "#fefefe",
    borderColor: "#fefefe",
    flexDirection: "row",
    minHeight: 40,
    justifyContent: "space-between",
    // marginTop: 20,
    alignItems: "center",
    alignContent: "center",
    borderRadius: 15,
    flexWrap: "wrap",
  },
  pillText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  pill: {
    borderRadius: 9,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    marginHorizontal: 3,
  },
  pillSelected: {
    backgroundColor: "#B6D0E2",
  },
  btn: {
    marginVertical: 15,
    height: 50,
    // textAlign:"center",
    backgroundColor: "#475ba3",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#475ba3",
  },
  btnDisabled: {
    marginVertical: 15,
    height: 50,
    // textAlign:"center",
    backgroundColor: "#AAB3D1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#AAB3D1",
  },
});
