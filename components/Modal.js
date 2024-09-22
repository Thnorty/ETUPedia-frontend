import RNModal from "react-native-modal"
import {Dimensions, KeyboardAvoidingView, StatusBar, View} from "react-native";
import {useState} from "react";

const Modal = ({ isVisible, onBackdropPress = () => {}, onModalHide = () => {}, children }) => {
  const [isClosing, setIsClosing] = useState(false);

  const deviceHeight = StatusBar.currentHeight + Dimensions.get('window').height;
  return (
    <RNModal
      isVisible={isVisible}
      animationIn={"fadeIn"}
      animationOut={"fadeOut"}
      animationInTiming={100}
      animationOutTiming={100}
      backdropTransitionInTiming={0}
      backdropTransitionOutTiming={0}
      backdropOpacity={0.5}
      statusBarTranslucent={true}
      deviceHeight={deviceHeight}
      avoidKeyboard={true}
      onBackdropPress={() => {
        if (!isClosing) {
          setIsClosing(true);
          onBackdropPress();
        }
      }}
      onBackButtonPress={() => {
        if (!isClosing) {
          setIsClosing(true);
          onBackdropPress();
        }
      }}
      onModalHide={() => {
        setIsClosing(false);
        onModalHide();
      }}
    >
      <KeyboardAvoidingView behavior={"padding"} keyboardVerticalOffset={StatusBar.currentHeight}>
        <View>
          {children}
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

export default Modal;
