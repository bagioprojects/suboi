import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '@/core/theme';
import { SurfaceCard } from './SurfaceCard';
import { StatusBadge } from './StatusBadge';
import { Bot, Sparkles, ExternalLink, Quote } from 'lucide-react-native';

export interface AiCitation {
  id: string;
  engine: 'ChatGPT 4o' | 'Perplexity Pro' | 'Google Gemini 1.5' | 'Claude 3.7';
  userPrompt: string;
  answerSnippet: string;
  citationUrl: string;
  citedRank: string; // e.g. "1. Kaynak Tavsiyesi"
  date: string;
}

interface AiCitationCardProps {
  citation: AiCitation;
}

const AiCitationCardComponent: React.FC<AiCitationCardProps> = ({ citation }) => {
  return (
    <SurfaceCard style={styles.card} padding="standard">
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.engineWrap}>
          <Bot size={14} color={Colors.geoAi} />
          <Text style={styles.engineName}>{citation.engine}</Text>
        </View>
        <StatusBadge label={citation.citedRank} variant="geoAi" size="sm" />
      </View>

      {/* User Query Prompt Box */}
      <View style={styles.promptBox}>
        <Text style={styles.promptLabel}>Kullanıcı Sorgusu (Prompt):</Text>
        <Text style={styles.promptText}>"{citation.userPrompt}"</Text>
      </View>

      {/* AI Answer & Citation Box */}
      <View style={styles.answerBox}>
        <View style={styles.answerHeader}>
          <Quote size={13} color={Colors.textTertiary} />
          <Text style={styles.answerLabel}>Yapay Zeka Yanıtı & Referans:</Text>
        </View>
        <Text style={styles.answerText}>{citation.answerSnippet}</Text>
      </View>

      {/* Citation URL badge */}
      <View style={styles.footerRow}>
        <View style={styles.urlBadge}>
          <ExternalLink size={12} color={Colors.geoAi} />
          <Text style={styles.urlText}>{citation.citationUrl}</Text>
        </View>
        <Text style={styles.dateText}>{citation.date}</Text>
      </View>
    </SurfaceCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.cardGap,
    borderColor: '#E9D5FF',
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  engineWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.geoAiBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  engineName: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.geoAi,
    fontWeight: '700',
  },
  promptBox: {
    backgroundColor: '#F8FAFC',
    borderColor: Colors.borderHairline,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  promptLabel: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textTertiary,
    fontWeight: '600',
    marginBottom: 2,
  },
  promptText: {
    ...Typography.cardTitle,
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  answerBox: {
    backgroundColor: '#FAF5FF',
    borderColor: '#F3E8FF',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  answerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  answerLabel: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.geoAi,
    fontWeight: '600',
  },
  answerText: {
    ...Typography.body,
    fontSize: 12,
    lineHeight: 17,
    color: '#4C1D95',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  urlBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  urlText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.geoAi,
    fontWeight: '600',
  },
  dateText: {
    ...Typography.footnote,
    fontSize: 11,
    color: Colors.textTertiary,
  },
});

export const AiCitationCard = React.memo(AiCitationCardComponent);

