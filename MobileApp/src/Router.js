// Router
import { createStackNavigator } from 'react-navigation';

// Routes
import PhotoSelector from "./views/PhotoSelector";
import DetectionSelector from "./views/DetectionSelector";
import ResultsAnalysisFace from "./views/ResultsAnalysisFace";
import ResultsAnalysisLandscape from "./views/ResultsAnalysisLandscape";
import ResultsAnalysisText from "./views/ResultsAnalysisText";

// Style
const styleOptions = {
    navigationOptions: {
        headerTitleStyle: {
          fontWeight: '400',
          fontSize: 16,
          color: '#2C2F33',
          textTransform: 'uppercase'
        },
    },
    initialRouteName: 'PhotoSelectorView'
}

export const AppStack = createStackNavigator({
    PhotoSelectorView: PhotoSelector,
    DetectionSelectorView: DetectionSelector,
    ResultsAnalysisFaceView: ResultsAnalysisFace,
    ResultsAnalysisLandscapeView: ResultsAnalysisLandscape,
    ResultsAnalysisTextView: ResultsAnalysisText
}, styleOptions);