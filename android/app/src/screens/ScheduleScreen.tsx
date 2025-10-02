import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Calendar, DateData } from 'react-native-calendars'
import { theme } from '../theme'

interface MarkedDate {
  [key: string]: {
    marked: boolean;
    dotColor: string;
    selectedColor?: string;
    selected?: boolean;
    customStyles?: any;
  }
}

interface ScheduleItem {
  id: string;
  date: string;
  type: 'appointment' | 'reminder' | 'treatment';
  title: string;
  time: string;
}

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  
  // Sample schedule data
  const [scheduleData] = useState<ScheduleItem[]>([
    {
      id: '1',
      date: '2025-10-15',
      type: 'appointment',
      title: 'Dermatologist Consultation',
      time: '10:00 AM'
    },
    {
      id: '2',
      date: '2025-10-18',
      type: 'reminder',
      title: 'Apply Moisturizer',
      time: '8:00 PM'
    },
    {
      id: '3',
      date: '2025-10-20',
      type: 'treatment',
      title: 'Facial Treatment',
      time: '2:00 PM'
    },
    {
      id: '4',
      date: '2025-10-15',
      type: 'reminder',
      title: 'Take Vitamins',
      time: '9:00 AM'
    },
    {
      id: '5',
      date: '2025-10-22',
      type: 'appointment',
      title: 'Follow-up Check',
      time: '11:30 AM'
    }
  ])

  // Get marked dates for calendar
  const getMarkedDates = (): MarkedDate => {
    const marked: MarkedDate = {}
    
    scheduleData.forEach(item => {
      const date = item.date
      
      if (!marked[date]) {
        marked[date] = {
          marked: true,
          dotColor: getColorByType(item.type),
          dots: []
        }
      }
      
      // If multiple items on same date, create multiple dots
      if (marked[date].dots) {
        marked[date].dots.push({
          color: getColorByType(item.type)
        })
      } else {
        marked[date].dots = [{
          color: getColorByType(item.type)
        }]
      }
    })

    // Mark selected date
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: theme.colors.primary,
      }
    }

    return marked
  }

  const getColorByType = (type: 'appointment' | 'reminder' | 'treatment'): string => {
    switch (type) {
      case 'appointment':
        return theme.colors.primary; // Blue
      case 'reminder':
        return theme.colors.warning; // Orange
      case 'treatment':
        return theme.colors.secondary; // Green
      default:
        return theme.colors.text;
    }
  }

  const getIconByType = (type: 'appointment' | 'reminder' | 'treatment'): string => {
    switch (type) {
      case 'appointment':
        return '📅';
      case 'reminder':
        return '⏰';
      case 'treatment':
        return '💆‍♀️';
      default:
        return '📋';
    }
  }

  const getScheduleForDate = (date: string): ScheduleItem[] => {
    return scheduleData.filter(item => item.date === date)
  }

  const onDatePress = (day: DateData) => {
    setSelectedDate(day.dateString)
  }

  const selectedDateSchedule = getScheduleForDate(selectedDate)

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Schedule</Text>
        <Text style={styles.headerSubtitle}>Manage your skincare routine</Text>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Legend:</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
            <Text style={styles.legendText}>Appointment</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.colors.warning }]} />
            <Text style={styles.legendText}>Reminder</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.colors.secondary }]} />
            <Text style={styles.legendText}>Treatment</Text>
          </View>
        </View>
      </View>

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={onDatePress}
          markedDates={getMarkedDates()}
          markingType={'multi-dot'}
          theme={{
            backgroundColor: theme.colors.background,
            calendarBackground: theme.colors.background,
            textSectionTitleColor: theme.colors.text,
            selectedDayBackgroundColor: theme.colors.primary,
            selectedDayTextColor: theme.colors.background,
            todayTextColor: theme.colors.primary,
            dayTextColor: theme.colors.text,
            textDisabledColor: theme.colors.textSecondary,
            dotColor: theme.colors.primary,
            selectedDotColor: theme.colors.background,
            arrowColor: theme.colors.primary,
            disabledArrowColor: theme.colors.textSecondary,
            monthTextColor: theme.colors.text,
            indicatorColor: theme.colors.primary,
            textDayFontFamily: 'System',
            textMonthFontFamily: 'System',
            textDayHeaderFontFamily: 'System',
            textDayFontWeight: '400',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '400',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 13
          }}
        />
      </View>

      {/* Selected Date Schedule */}
      <View style={styles.scheduleContainer}>
        <Text style={styles.scheduleTitle}>
          Schedule for {new Date(selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
        
        {selectedDateSchedule.length > 0 ? (
          selectedDateSchedule.map((item) => (
            <View key={item.id} style={styles.scheduleItem}>
              <View style={styles.scheduleItemHeader}>
                <Text style={styles.scheduleItemIcon}>
                  {getIconByType(item.type)}
                </Text>
                <View style={styles.scheduleItemInfo}>
                  <Text style={styles.scheduleItemTitle}>{item.title}</Text>
                  <Text style={styles.scheduleItemTime}>{item.time}</Text>
                </View>
                <View style={[
                  styles.scheduleItemBadge, 
                  { backgroundColor: getColorByType(item.type) }
                ]}>
                  <Text style={styles.scheduleItemBadgeText}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noScheduleContainer}>
            <Text style={styles.noScheduleText}>No events scheduled for this date</Text>
          </View>
        )}
      </View>

      {/* Add New Button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add New Event</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  legendContainer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  legendTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    ...theme.typography.caption,
    color: theme.colors.text,
  },
  calendarContainer: {
    margin: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    ...theme.shadows.small,
  },
  scheduleContainer: {
    margin: theme.spacing.lg,
    marginTop: 0,
  },
  scheduleTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  scheduleItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  scheduleItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  scheduleItemIcon: {
    fontSize: 24,
  },
  scheduleItemInfo: {
    flex: 1,
  },
  scheduleItemTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  scheduleItemTime: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  scheduleItemBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.small,
  },
  scheduleItemBadgeText: {
    ...theme.typography.caption,
    color: theme.colors.background,
    fontWeight: '600',
    fontSize: 12,
  },
  noScheduleContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  noScheduleText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  addButton: {
    margin: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
  },
  addButtonText: {
    ...theme.typography.body,
    color: theme.colors.background,
    fontWeight: '600',
  },
}) 