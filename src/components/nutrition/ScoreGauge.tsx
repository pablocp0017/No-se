import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { AppText } from '@/components/ui/AppText';
import { Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface ScoreGaugeProps {
  score: number; // 0-100
  desglose?: string;
}

export function ScoreGauge({ score, desglose }: ScoreGaugeProps) {
  const colors = useThemeColors();
  const color = score >= 75 ? colors.success : score >= 50 ? colors.warning : colors.danger;

  const w = 220;
  const h = 130;
  const r = 90;
  const circunferenciaMedia = Math.PI * r;
  const offset = circunferenciaMedia * (1 - Math.min(Math.max(score, 0), 100) / 100);

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <Path d={`M 20 120 A 90 90 0 0 1 200 120`} fill="none" stroke={colors.border} strokeWidth={14} strokeLinecap="round" />
        <Path
          d={`M 20 120 A 90 90 0 0 1 200 120`}
          fill="none"
          stroke={color}
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={`${circunferenciaMedia} ${circunferenciaMedia}`}
          strokeDashoffset={offset}
        />
      </Svg>
      <View style={{ marginTop: -54, alignItems: 'center' }}>
        <AppText variant="displayLg">{Math.round(score)}</AppText>
        <AppText variant="caption" color="inkMuted">
          / 100
        </AppText>
      </View>
      {desglose ? (
        <AppText variant="bodySm" color="inkMuted" style={{ marginTop: Spacing.space2, textAlign: 'center', maxWidth: 300 }}>
          {desglose}
        </AppText>
      ) : null}
    </View>
  );
}
