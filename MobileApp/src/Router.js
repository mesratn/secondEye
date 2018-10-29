// Router
import { createStackNavigator } from 'react-navigation';

// Routes
import PhotoSelector from "./views/photoSelector";
import DetectionSelector from "./views/detectionSelector";
import ResultsAnalysisFace from "./views/resultsAnalysisFace";
import ResultsAnalysisLandscape from "./views/resultsAnalysisLandscape";
import ResultsAnalysisText from "./views/resultsAnalysisText";

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
    initialRouteName: 'photoSelectorView'
}

export const AppStack = createStackNavigator({
    photoSelectorView: PhotoSelector,
    detectionSelectorView: DetectionSelector,
    resultsAnalysisFaceView: ResultsAnalysisFace,
    resultsAnalysisLandscapeView: ResultsAnalysisLandscape,
    resultsAnalysisTextView: ResultsAnalysisText
}, styleOptions);