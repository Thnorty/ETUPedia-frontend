import RNModal from "react-native-modal"
import {Dimensions, StatusBar} from "react-native";
import {useState} from "react";

const Modal = ({ isVisible, onBackdropPress, onModalHide, children }) => {
  const [isClosing, setIsClosing] = useState(false);

  const deviceHeight = StatusBar.currentHeight + Dimensions.get('window').height;
  return (
    <RNModal
      isVisible={isVisible}
      animationIn={"fadeIn"}
      animationOut={"fadeOut"}
      animationOutTiming={500}
      backdropOpacity={0.5}
      statusBarTranslucent={true}
      deviceHeight={deviceHeight}
      onBackdropPress={() => {
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
      {children}
    </RNModal>
  );
}

export default Modal;
