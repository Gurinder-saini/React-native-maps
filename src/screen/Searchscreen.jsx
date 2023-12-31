import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
  Keyboard,
} from 'react-native';
import React, {useEffect} from 'react';
import Iicon from 'react-native-vector-icons/Ionicons';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const Searchscreen = ({doonpress}) => {

  const {width, height} = useWindowDimensions();

  const viewheight = useSharedValue(0);
  const showcontent = useSharedValue(0);

  useEffect(() => {
    viewheight.value = withTiming(350, {duration: 500}, () => {
      showcontent.value = withSpring(1, {duration: 1000});
    });
  }, []);

  const animatedviewstyle = useAnimatedStyle(() => {
    return {
      height: viewheight.value,
    };
  });

  const animatedcontent = useAnimatedStyle(() => {
    return {
      opacity: showcontent.value,
    };
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#38383954',
      }}>
      <StatusBar barStyle={'dark-content'} />
      <Animated.View
        style={[
          {
            width,
            borderBottomRightRadius: 30,
            borderBottomLeftRadius: 30,
            backgroundColor: 'white',
            elevation: 10,
            shadowColor: 'black',
          },
          animatedviewstyle,
        ]}>
        <Animated.View
          style={[
            animatedcontent,
            {
              paddingTop: StatusBar.currentHeight,
              padding: 20,
              flexDirection: 'column',
              rowGap: 10,
              flex:1
            },
          ]}>
          

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 10,
            }}>
            <Pressable
              onPress={() => {
                showcontent.value = withSpring(0, {duration: 100}, () => {
                  viewheight.value = withTiming(0, {duration: 300}, () => {
                    runOnJS(doonpress)();
                  });
                });
              }}>
              <Iicon name="arrow-back-outline" size={30} color="#191919" />
            </Pressable>
            <Text
              style={{
                fontFamily: 'Poppins-Bold',
                fontSize: 25,
                color: '#2d2d2d',
                bottom: -2,
              }}>
              Search
            </Text>
          </View>
          <View
            style={{
            paddingHorizontal: 10,
            flex:1
        }}>
            <GooglePlacesAutocomplete
                enablePoweredByContainer={false}
                isRowScrollable={true}
                styles={{
                    textInputContainer:{
                        height: 53,
                        borderRadius: 20,
                        borderWidth: 2,
                        borderColor: 'lightgrey',
                          overflow:"hidden",
                    },
                    listView:{
                        top:10,
                        backgroundColor:'white'
                    },
                    textInput:{
                        height: 53,
                        alignSelf:'center',
                        fontFamily:'Poppins-Regular',
                        bottom:-4,
                    },
                    row:{
                        fontFamily:'Poppins-Regular',
                        width:width-60,
                        borderRadius:10,
                        backgroundColor:'white',
                        padding:13,
                        height:35,
                        alignItems:'center'
                    }
                }}
            placeholder="Search"
            fetchDetails={true}
            onPress={(data, details) => {
              console.log('hii')
              const result = details.geometry.location
                showcontent.value = withSpring(0, {duration: 100}, () => {
                    viewheight.value = withTiming(0, {duration: 300}, () => {
                      runOnJS(doonpress)(result)
                    })
                  })
            }}
            query={{
              key: 'AIzaSyBZbpbzC4v4HLREkD-FPdhiJZjc8Pc_uR0',
              language: 'en',
            }}
          />
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default Searchscreen;

const styles = StyleSheet.create({});
