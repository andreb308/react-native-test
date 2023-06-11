import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  StatusBar,
  Dimensions,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

const hardcodedCities = [
  {
    id: 1,
    name: 'Tokyo',
    coordinates: {
      latitude: 35.6895,
      longitude: 139.6917,
    },
  },
  {
    id: 2,
    name: 'Paris',
    coordinates: {
      latitude: 48.8566,
      longitude: 2.3522,
    },
  },
  {
    id: 3,
    name: 'New York City',
    coordinates: {
      latitude: 40.7128,
      longitude: -74.006,
    },
  },
];

export default function App() {
  const mapRef = React.useRef(null);
  const [texto, setTexto] = React.useState('Maroon');
  const [cities, setCities] = React.useState([]);
  const [initialRegion, setInitialRegion] = React.useState(null);

  function moveToCity(city) {
    const { latitude, longitude } = city.coordinates;
    const region = {
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    setInitialRegion(region);
    mapRef.current.animateToRegion(region, 3000);
  }

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setInitialRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      setCities(hardcodedCities);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/*         <View // Text + Input Container
              style=
                {{
                  margin: 0,
                  flex: 0.3,
                  backgroundColor: 'maroon',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                <Text
                  onPress={() => {setTexto("Cliclou")}}
                  style={{
                    position: 'absolute',
                    top: 0,
                    fontSize: 30,
                    marginTop: 10,
                    backgroundColor: 'pink',
                    padding: 5,
                    paddingLeft: 50,
                    paddingRight: 50,
                    borderRadius: 50,
                    }}>App Title</Text>

                <TextInput
                  onChangeText={(texto) => setTexto(texto)}
                  value={texto}
                  placeholder='Teste'
                  style={{
                    textAlign: 'center',
                    width: 200, 
                    height: 50, 
                    backgroundColor: 'pink', 
                    // paddingLeft: 20, 
                    borderRadius: 50, 
                    margin: 20}}/>

                <Text style={{color: 'white', fontSize: 20}}>{texto}</Text>
            </View> */}
      <StatusBar translucent backgroundColor="transparent" />
      {initialRegion && (
        <MapView // Map
          style={styles.map}
          initialRegion={initialRegion}
          ref={mapRef}>
          <Marker coordinate={initialRegion} />
        </MapView>
      )}

      <View // ButtonContainer
        style={styles.buttonContainer}>
        {cities.map((city) => (
          <View key={city.id} style={styles.button}>
            <Button
              title={city.name}
              onPress={() => moveToCity(city)}
              color="purple"
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    // padding: 8,
  },
  map: { ...StyleSheet.absoluteFillObject, flex: 1, zIndex: -1 },
  buttonContainer: {
    display: 'flex',
    position: 'absolute',
    bottom: Dimensions.get('window').height * 0.1,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    zIndex: 1,
  },
  button: {
    width: Dimensions.get('window').width * 0.5,
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 80,
    overflow: 'hidden',
  },
});
