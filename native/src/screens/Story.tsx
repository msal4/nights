import ViewPager, {PageScrollStateChangedEvent} from '@react-native-community/viewpager';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, ImageBackground, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Story} from '../components/Story';
import {colors} from '../constants/style';
import {Story as IStory} from '../core/interfaces/story';

export const StoryScreen: React.FC = () => {
  const {
    params: {stories, index},
  } = useRoute() as {params: {index: number; stories: IStory[]}};
  const [progress, setProgress] = useState({position: 0, offset: 0});
  const [page, setPage] = useState(index || 0);
  const [scrollState, setScrollState] = useState<PageScrollStateChangedEvent['pageScrollState']>('idle');
  const viewPager = useRef<ViewPager>();
  const navigation = useNavigation();

  const progressAnim = useRef(new Animated.Value(index + 1)).current;

  const fractionalPosition = progress.position + progress.offset;

  let progressBarSize = (fractionalPosition / (stories.length - 1)) * 100;
  progressBarSize = progressBarSize < 0 ? 0 : progressBarSize > 100 ? 100 : progressBarSize;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: page + 1,
      duration: 200,
      useNativeDriver: false,
      // easing: Easing.ease,
    }).start();
  }, [page]);

  return (
    <>
      <ImageBackground
        source={{uri: stories[page].image}}
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
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon type="ionicon" name="close-outline" color={colors.white} size={50} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{height: 100}} />
        <View
          style={{
            width: '100%',
            height: 5,
            overflow: 'hidden',
          }}>
          <Animated.View
            style={{
              height: '100%',
              width: `${progressBarSize}%`,
            }}>
            <LinearGradient
              useAngle
              angle={90}
              colors={[colors.blue, colors.red]}
              style={{
                height: '100%',
                width: '100%',
                flex: 1,
              }}
            />
          </Animated.View>
        </View>
        <ViewPager
          style={{flex: 1}}
          initialPage={index}
          keyboardDismissMode="on-drag"
          onPageScroll={(e) => {
            setProgress(e.nativeEvent);
          }}
          onPageSelected={(e) => {
            setPage(e.nativeEvent.position);
          }}
          onPageScrollStateChanged={(e) => {
            setScrollState(e.nativeEvent.pageScrollState);
          }}
          // pageMargin={10}
          // Lib does not support dynamically orientation change
          orientation="horizontal"
          // Lib does not support dynamically transitionStyle change
          transitionStyle="scroll"
          ref={viewPager as any}>
          {stories.map((p, index) => (
            <Story key={p.id} story={p} currentPage={page === index} />
          ))}
        </ViewPager>
      </SafeAreaView>
    </>
  );
};
