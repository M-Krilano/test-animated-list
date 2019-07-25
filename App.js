import React from "react";
import {
  Animated,
  FlatList,
  PanResponder,
  StyleSheet,
  Text,
  View
} from "react-native";

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const colorMap = {};

export default class App extends React.Component {
  state = {
    dragging: false,
    data: Array.from(Array(200), (_, i) => {
      colorMap[i] = getRandomColor();
      return i;
    })
  };

  // current position of users finger
  point = new Animated.ValueXY();

  constructor(props) {
    super(props);
    // copied from react native docs
    // source: https://facebook.github.io/react-native/docs/panresponder.html
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      // user has started touch event -> show something on the screen to show movement
      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
        console.log(gestureState.y0);
        this.setState({ dragging: true });
      },

      onPanResponderMove: (evt, gestureState) => {
        // we map gestureState.moveY and set it to the point.Y
        Animated.event([{ y: this.point.y }])({ y: gestureState.moveY });
        console.log(gestureState.moveY);
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      // changed to false so it doesn't get interrupted when dragging and dropping
      onPanResponderTerminationRequest: (evt, gestureState) => false,

      // **** release and terminate is used to reset the state after the user stopped dragging
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      }
    });
  }

  render() {
    const { data, dragging } = this.state;

    const renderItem = ({ item }) => (
      <View
        style={{
          padding: 16,
          backgroundColor: colorMap[item],
          flexDirection: "row"
        }}
      >
        <View {...this._panResponder.panHandlers}>
          <Text style={{ fontSize: 24 }}>@</Text>
        </View>
        <Text style={{ fontSize: 22, textAlign: "center", flex: 1 }}>
          {item}
        </Text>
      </View>
    );

    return (
      <View style={styles.container}>
        <Animated.View
          style={{
            backgroundColor: "black",
            zIndex: 2,
            height: 30,
            width: "100%",
            borderRadius: 15,
            top: this.point.getLayout().top
          }}
        >
          {renderItem({ item: 3 })}
        </Animated.View>
        <FlatList
          scrollEnabled={!dragging}
          style={{ width: "100%" }}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => "" + item}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
