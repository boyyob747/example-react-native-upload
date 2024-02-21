/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  Alert,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';


function App(): React.JSX.Element {
  const [singleFile, setSingleFile] = useState<DocumentPickerResponse[]>([]);
  const [result, setResult] = useState<String>('')
  const selectFile = async () => {
    try {
      // CODE HERE
      setResult('')
      setSingleFile([])
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images] // They can more options as well
      });
      setSingleFile(res)
    } catch (err) {
      console.log('error', err);
    }
  }

  const uploadImage = async () => {
    // Check if any file is selected or not
    if (singleFile != null) {
      const fileToUpload = singleFile;
      const data = new FormData();
      setResult('');
      // CODE HERE
      console.log('fileToUpload', JSON.stringify(singleFile));
      data.append('file', fileToUpload[0]);
      try {
        let res = await fetch(
          'https://remove-background-image2.p.rapidapi.com/remove-background',
          {
            method: 'post',
            body: data,
            headers: {
              'X-RapidAPI-Key': '6bacf13d0cmsh24ff92aec1d47a7p1072f0jsn59b4f39582ed',
              'X-RapidAPI-Host': 'remove-background-image2.p.rapidapi.com',
              // 'Content-Type': 'multipart/form-data;', อาจไม่ต้องใช้ก็ได้
            },
          }
        );
        let responseJson = await res.json();
        console.log('Upload Successful', responseJson);

        if (responseJson.image) {
          console.log('Upload Successful');
          setResult(responseJson.image);
        } else {
          console.log('Upload Status', 'Image null');
        }
      } catch(err) {
        console.log('error', err);
      }
    } else {
      console.log('Please Select File first');
    }
  };


  return (
    <SafeAreaView style={{ backgroundColor: Colors.darker }}>
      <ScrollView
        style={{ backgroundColor: Colors.darker }}>
        <View
          style={{
            marginTop: 80,
          }}>
          <Button title='Pick' onPress={
            selectFile
          } />
          <View style={{ margin: 18 }}>
            {
              singleFile.map((file, index) => (
                <View key={index}>
                  <Text
                    key={index.toString()}
                    numberOfLines={1}
                    ellipsizeMode={'middle'}>
                    {file?.uri}
                  </Text>
                  <Button title='Upload' onPress={
                    uploadImage
                  } />
                  <Image
                    source={{
                      uri: 'data:image/*;base64,' + result,
                    }} height={300}
                  />

                </View>
              ))
            }

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
