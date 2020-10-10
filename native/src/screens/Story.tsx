import ViewPager, {PageScrollStateChangedEvent} from '@react-native-community/viewpager';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {Image, ImageBackground, StatusBar, View} from 'react-native';
import {Icon} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Story} from '../components/Story';
import {colors} from '../constants/style';

export const StoryScreen: React.FC = () => {
  const {params} = useRoute() as {params: {index: number}};
  const [progress, setProgress] = useState({position: 0, offset: 0});
  const [page, setPage] = useState(params.index || 0);
  const [scrollState, setScrollState] = useState<PageScrollStateChangedEvent['pageScrollState']>('idle');
  const viewPager = useRef<ViewPager>();
  const navigation = useNavigation();
  const pages = [0, 1, 2, 3];

  const fractionalPosition = progress.position + progress.offset;

  let progressBarSize = (fractionalPosition / (pages.length - 1)) * 100;
  progressBarSize = progressBarSize < 0 ? 0 : progressBarSize > 100 ? 100 : progressBarSize;

  return (
    <>
      <ImageBackground
        source={require('../../assets/mock-story.png')}
        blurRadius={50}
        style={{position: 'absolute', width: '100%', height: 200}}>
        <LinearGradient colors={['#00000022', '#00000055', '#000000']} style={{height: '100%'}} />
      </ImageBackground>

      <SafeAreaView edges={['top']} style={{flex: 1, backgroundColor: 'transparent'}}>
        <View style={{position: 'relative', zIndex: 100}}>
          <View
            style={{
              position: 'absolute',
              right: 10,
              top: 10,
              zIndex: 100,
            }}>
            <Icon
              type="ionicon"
              name="close-outline"
              color={colors.white}
              size={50}
              onPress={() => {
                navigation.goBack();
              }}
            />
          </View>
        </View>
        <View style={{height: 100}} />
        <View
          style={{
            width: '100%',
            height: 5,
            overflow: 'hidden',
          }}>
          <LinearGradient
            useAngle
            angle={90}
            colors={[colors.blue, colors.red]}
            style={{height: '100%', width: `${progressBarSize}%`}}
          />
        </View>
        <ViewPager
          style={{flex: 1}}
          initialPage={params.index}
          scrollEnabled={true}
          onPageScroll={(e) => {
            setProgress(e.nativeEvent);
          }}
          onPageSelected={(e) => {
            setPage(e.nativeEvent.position);
          }}
          onPageScrollStateChanged={(e) => {
            setScrollState(e.nativeEvent.pageScrollState);
          }}
          pageMargin={10}
          // Lib does not support dynamically orientation change
          orientation="horizontal"
          // Lib does not support dynamically transitionStyle change
          transitionStyle="scroll"
          ref={viewPager as any}>
          {pages.map((p) => (
            <Story key={p} id={p} currentPage={page} />
          ))}
        </ViewPager>
      </SafeAreaView>
    </>
  );
};
