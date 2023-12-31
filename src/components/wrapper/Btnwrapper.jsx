import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import Animated,{ useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const Btnwrapper = ({position, children, bottom, backgroundColor, doonpress, searchscreen}) => {
  let custmstyle = {};
  const hideleftbtn = useSharedValue(10)

  if(searchscreen){
    if(position==='left'){
        hideleftbtn.value = withTiming(-100,{duration:300})
    }else{
        hideleftbtn.value = withTiming(100,{duration:300})
    }
}else{
      if(position==='left'){
          hideleftbtn.value = withTiming(0,{duration:300})
      }else{
          hideleftbtn.value = withTiming(0,{duration:300})
      }

  }

  if (position==='left'){
    custmstyle = {
        left:0,
        borderTopRightRadius:20,
        borderBottomRightRadius:20,
    }
  }else if(position==='right'){
    custmstyle={
        right:0,
        borderTopLeftRadius: 20,
        borderBottomStartRadius: 20,
    }
  }

  const animatedbtn = useAnimatedStyle(()=>{
    return {
        transform:[{translateX:hideleftbtn.value}]
    }
  })
  return (
    <Animated.View style={[styles.wrapper, custmstyle, {bottom, backgroundColor}, animatedbtn]}>
      <TouchableOpacity onPress={doonpress}>{children}</TouchableOpacity>
    </Animated.View>
  );
};

export default Btnwrapper;

const styles = StyleSheet.create({
    wrapper: {
    position: 'absolute',
    elevation:6,
    shadowColor:'black',
    // backgroundColor: 'white',
    paddingHorizontal: 17,
    paddingVertical: 10,
  },
});
