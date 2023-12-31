import {
  View,
  useWindowDimensions,
  Text,
  StyleSheet,
  StatusBar,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import Micon from 'react-native-vector-icons/MaterialIcons';
import Ficon from 'react-native-vector-icons/FontAwesome5';
import Btnwrapper from './src/components/wrapper/Btnwrapper';
import Searchscreen from './src/screen/Searchscreen';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';

const App = () => {

  const {width, height} = useWindowDimensions();
  const [searchscreen, setsearchscreen] = useState(false);
  const [currentlocation, setcurrentlocation] = useState(null);
  const [isdirectionactive, setisdirectionactive] = useState(false);
  const [destination, setdestination] = useState(null);
  const exploramimation = useSharedValue(0);
  const mapref = useRef(null);

  useEffect(() => {
    if (currentlocation) {
      mapref.current.animateToRegion(
        {
          ...currentlocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        2000,
      );
    }
  }, [currentlocation]);

  const getlocationpermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'get location permission',
        message:
          'map need you current location ' + 'so you can track yourself.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('we got your location');
      getcurrentlocation();
    } else {
      console.log('permission denied');
    }
  };

  const getcurrentlocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setcurrentlocation({latitude: latitude, longitude: longitude});
        console.log('Current Location:', latitude, longitude);
      },
      error => {
        console.error('Error getting current location:', error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
      },
    );
  };

  if (searchscreen) {
    exploramimation.value = withTiming(100, {duration: 300});
  } else {
    exploramimation.value = withTiming(0, {duration: 300});
  }

  const searchlocation = (result = null) => {
    if (result) {
      const {lat, lng} = result;
      setdestination({
        latitude: lat, longitude: lng
      });
    }
    setsearchscreen(!searchscreen);
    if(!searchscreen){
      setisdirectionactive(false)
    }else if(destination && currentlocation && searchscreen){
        setisdirectionactive(true)
    }
  };

  const exploranimtedstyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: exploramimation.value}],
    };
  });

  const activatedirection = () => {
    if(destination && currentlocation && !isdirectionactive){
      setisdirectionactive(true)
    }else{
      setisdirectionactive(false)
    }
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <StatusBar backgroundColor={'transparent'} translucent />
      <MapView
        initialRegion={{
          latitude: 22.9734,
          longitude: 78.6569,
          latitudeDelta: 30,
          longitudeDelta: 30,
        }}
        ref={mapref}
        style={StyleSheet.absoluteFill}
        rotateEnabled={false}
        mapType='standard'>
        {currentlocation && (
          <Marker
            draggable
            onDragEnd={direction => {
              setcurrentlocation(direction.nativeEvent.coordinate);
            }}
            coordinate={{
              latitude: currentlocation.latitude,
              longitude: currentlocation.longitude,
            }}>
            <View
              style={{
                alignItems: 'center',
                gap: 1,
              }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 30,
                  borderWidth: 2,
                  borderColor: 'lightgrey',
                  backgroundColor: 'white',
                }}></View>
              <View
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 30,
                  borderWidth: 1,
                  borderColor: 'lightgrey',
                  backgroundColor: 'white',
                }}></View>
            </View>
          </Marker>
        )}
        {isdirectionactive && (
          <Marker
            draggable
            onDragEnd={direction => {
              setdestination(direction.nativeEvent.coordinate);
            }}
            coordinate={destination}></Marker>
        )}
        {
          currentlocation && destination && isdirectionactive &&
          <MapViewDirections
          origin={currentlocation}
          destination={{latitude:destination.latitude, longitude:destination.longitude}}
          strokeWidth={3}
          strokeColor="#ae0909"
          apikey={'add your api key , you can get your own api key from google console and also add api key in Androidmanifest.xml file'}
          />
        }
        
      </MapView>
      <LinearGradient
        colors={['#191919', 'transparent']}
        style={{
          position: 'absolute',
          height: 50,
          width,
        }}
      />

      <Btnwrapper
        position={'right'}
        bottom={80}
        backgroundColor="white"
        doonpress={() => {
          PermissionsAndroid.PERMISSIONS.GRANTED
            ? getcurrentlocation()
            : getlocationpermission();
        }}
        searchscreen={searchscreen}>
        <Micon
          name="my-location"
          size={28}
          color={currentlocation ? '#34a853' : '#191919'}
        />
      </Btnwrapper>
      <Btnwrapper
        position={'right'}
        bottom={140}
        backgroundColor="white"
        doonpress={searchlocation}
        searchscreen={searchscreen}>
        <Micon name="search" size={28} color="#191919" />
      </Btnwrapper>
      <Btnwrapper
        position={'right'}
        bottom={200}
        doonpress={activatedirection}
        backgroundColor={isdirectionactive ? '#399cfe' : 'white'}
        searchscreen={searchscreen}>
        <Micon
          name="directions"
          size={28}
          color={isdirectionactive ? 'white' : '#191919'}
        />
      </Btnwrapper>
      <Btnwrapper
        position={'left'}
        bottom={80}
        backgroundColor="white"
        searchscreen={searchscreen}>
        <Ficon name="layer-group" size={25} color="#191919" />
      </Btnwrapper>
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: 0,
            alignSelf: 'center',
            paddingHorizontal: 40,
            backgroundColor: 'white',
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 6,
            shadowColor: 'black',
          },
          exploranimtedstyle,
        ]}>
        <Micon
          name="keyboard-arrow-up"
          size={30}
          color="#191919"
          style={{marginBottom: -7}}
        />
        <Text
          style={{
            fontFamily: 'Poppins-Bold',
            color: '#191919',
            fontSize: 15,
          }}>
          Explore
        </Text>
      </Animated.View>
      {searchscreen && <Searchscreen doonpress={searchlocation} />}
    </View>
  );
};

export default App;
