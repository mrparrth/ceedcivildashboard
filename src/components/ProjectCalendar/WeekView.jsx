import React, { useMemo } from "react";
import { Box, Typography, Paper, Tooltip } from "@mui/material";

const WeekView = ({ currentDate, visibleTimelineData, editRow }) => {
  const weeks = useMemo(() => {
    const days = [];
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const firstDay = new Date(monthStart);
    firstDay.setDate(firstDay.getDate() - firstDay.getDay());
    const lastDay = new Date(monthEnd);
    lastDay.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    // Group into weeks
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  }, [currentDate]);

  const formatDate = (date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const formatDay = (date) => date.toLocaleDateString("en-US", { weekday: "short" });

  // Helper function to check if a date is in the current month
  const isDateInCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
  };

  // Helper function to format date with month for out-of-month dates
  const formatDateWithMonth = (date) => {
    if (isDateInCurrentMonth(date)) {
      return date.getDate().toString();
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getProjectTimelineMapForWeek = (week) => {
    const weekStart = new Date(week[0]);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(week[6]);
    weekEnd.setHours(23, 59, 59, 999);
    const map = new Map();
    visibleTimelineData.forEach(({ project, timelines }) => {
      const weekTimelines = timelines.filter((tl) => tl.end >= weekStart && tl.start <= weekEnd);
      if (weekTimelines.length > 0) {
        map.set(project.id, { project, timelines: weekTimelines });
      }
    });
    return Array.from(map.values());
  };

  const getBarPlacementsForProjectWeek = (timelines, week) => {
    const weekStart = new Date(week[0]);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(week[6]);
    weekEnd.setHours(23, 59, 59, 999);
    return timelines.map((timeline) => {
      // Clamp bar to week
      const barStartIdx = Math.max(0, Math.floor((Math.max(timeline.start, weekStart) - weekStart) / (24 * 60 * 60 * 1000)));
      const barEndIdx = Math.min(6, Math.floor((Math.min(timeline.end, weekEnd) - weekStart) / (24 * 60 * 60 * 1000)));
      // Border radius logic
      const isLeftFlat = timeline.start < weekStart;
      const isRightFlat = timeline.end > weekEnd;
      let barRadius = "12px";
      if (isLeftFlat && isRightFlat) barRadius = "0";
      else if (isLeftFlat) barRadius = "0 12px 12px 0";
      else if (isRightFlat) barRadius = "12px 0 0 12px";
      return {
        timeline,
        barStartIdx,
        barEndIdx,
        barRadius,
      };
    });
  };

  // Helper function to get projects for a specific day
  const getProjectsForDay = (dayIndex, projectsInWeek) => {
    const dayStart = new Date(projectsInWeek[0]?.project ? new Date() : new Date());
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    return projectsInWeek.filter(({ project, timelines }) => {
      return timelines.some((timeline) => {
        const barStartIdx = Math.max(0, Math.floor((Math.max(timeline.start, dayStart) - dayStart) / (24 * 60 * 60 * 1000)));
        const barEndIdx = Math.min(6, Math.floor((Math.min(timeline.end, dayEnd) - dayStart) / (24 * 60 * 60 * 1000)));
        return barStartIdx <= dayIndex && barEndIdx >= dayIndex;
      });
    });
  };

  // Helper function to organize projects by vertical position
  const organizeProjectsByPosition = (projectsInWeek, week) => {
    const positions = new Map(); // projectId -> position index
    const maxProjectsPerDay = 3;

    // Sort projects by start date to maintain consistent ordering
    const sortedProjects = [...projectsInWeek].sort((a, b) => {
      const aStart = Math.min(...a.timelines.map((t) => t.start));
      const bStart = Math.min(...b.timelines.map((t) => t.start));
      return aStart - bStart;
    });

    // For each day, assign positions to projects
    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
      const dayProjects = getProjectsForDay(dayIdx, sortedProjects);
      const visibleProjects = dayProjects.slice(0, maxProjectsPerDay);

      visibleProjects.forEach((projectData, index) => {
        if (!positions.has(projectData.project.id)) {
          positions.set(projectData.project.id, index);
        }
      });
    }

    return positions;
  };

  console.log(weeks);

  return (
    <Paper elevation={2} className="calendar-grid-container" style={{ position: "relative" }}>
      <Box className="calendar-grid">
        {/* Header: days of week and dates */}
        <Box
          className="calendar-grid-header"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#f8f9fa",
          }}>
          {weeks[0].map((date, idx) => (
            <Box
              key={idx}
              className="calendar-grid-header-cell"
              style={{
                padding: "8px",
                textAlign: "center",
                borderRight: idx < 6 ? "1px solid #e0e0e0" : "none",
              }}>
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                {formatDay(date)}
              </Typography>
            </Box>
          ))}
        </Box>

        {weeks.map((week, wIdx) => {
          const projectsInWeek = getProjectTimelineMapForWeek(week);
          const projectPositions = organizeProjectsByPosition(projectsInWeek, week);

          return (
            <Box key={wIdx} style={{ position: "relative" }}>
              {/* Grid background for the week */}
              <Box
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  borderBottom: "1px solid #e0e0e0",
                  minHeight: "135px",
                }}>
                {week.map((date, dIdx) => {
                  const isCurrentMonth = isDateInCurrentMonth(date);

                  return (
                    <Box
                      key={dIdx}
                      style={{
                        borderRight: dIdx < 6 ? "1px solid #e0e0e0" : "none",
                        padding: "4px 8px",
                        backgroundColor: isCurrentMonth ? "#fff" : "#f5f5f5",
                        position: "relative",
                        opacity: isCurrentMonth ? 1 : 0.6,
                      }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontSize: 13,
                          color: isCurrentMonth ? "#000" : "#888",
                        }}>
                        {formatDateWithMonth(date)}
                      </Typography>

                      {/* Show "+X more" indicator if there are more than 3 projects for this day */}
                      {(() => {
                        const dayStart = new Date(date);
                        dayStart.setHours(0, 0, 0, 0);
                        const dayEnd = new Date(date);
                        dayEnd.setHours(23, 59, 59, 999);

                        const dayProjects = projectsInWeek.filter(({ project, timelines }) => {
                          return timelines.some((timeline) => {
                            return timeline.start <= dayEnd && timeline.end >= dayStart;
                          });
                        });

                        const extraCount = dayProjects.length - 3;
                        console.log(date, extraCount);
                        if (extraCount > 0) {
                          return (
                            <Box
                              style={{
                                position: "absolute",
                                bottom: "4px",
                                right: "4px",
                                backgroundColor: isCurrentMonth ? "#f0f0f0" : "#e0e0e0",
                                color: isCurrentMonth ? "#666" : "#999",
                                fontSize: "10px",
                                padding: "2px 6px",
                                borderRadius: "8px",
                                fontWeight: 600,
                              }}>
                              +{extraCount} more
                            </Box>
                          );
                        }
                        return null;
                      })()}
                    </Box>
                  );
                })}
              </Box>

              {/* Timeline bars overlay */}
              <Box
                style={{
                  position: "absolute",
                  top: "24px", // Space for date number
                  left: 0,
                  right: 0,
                  bottom: 0,
                  pointerEvents: "none",
                }}>
                {projectsInWeek.slice(0, 3).map(({ project, timelines }) => {
                  const placements = getBarPlacementsForProjectWeek(timelines, week);
                  const position = projectPositions.get(project.id) || 0;

                  return (
                    <Box key={project.id} className="timeline-content" style={{ position: "relative" }}>
                      {placements.map((b, i) => {
                        const leftPct = (b.barStartIdx / 7) * 100;
                        const widthPct = ((b.barEndIdx - b.barStartIdx + 1) / 7) * 100;
                        const topOffset = position * 26; // 24px height + 2px margin

                        return (
                          <Tooltip
                            key={`${project.id}-${b.timeline.type}-${wIdx}-${i}`}
                            title={
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#222" }}>
                                  #{project.projectNumber} - {b.timeline.label}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#222" }}>
                                  Assigned to: {project.assignedTo?.join(", ") || "Unassigned"}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#222" }}>
                                  Duration: {formatDate(b.timeline.start)} – {formatDate(b.timeline.end)}
                                </Typography>
                              </Box>
                            }
                            arrow
                            enterDelay={500}
                            leaveDelay={0}
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  backgroundColor: "#ECEFF1",
                                  fontWeight: "bold",
                                },
                              },
                              arrow: {
                                sx: {
                                  color: b.timeline.color,
                                },
                              },
                            }}>
                            <Box
                              className={`timeline-bar ${b.timeline.className}`}
                              style={{
                                position: "absolute",
                                left: `${leftPct}%`,
                                width: `${widthPct}%`,
                                height: "24px",
                                // top: `${topOffset}px`,
                                backgroundColor: b.timeline.color,
                                color: "#fff",
                                borderRadius: b.barRadius,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-start",
                                fontWeight: 600,
                                paddingLeft: 8,
                                cursor: "pointer",
                                zIndex: 2,
                                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                pointerEvents: "auto",
                                marginBottom: "2px",
                              }}
                              onClick={() => editRow(project.id)}>
                              <Typography variant="caption" className="timeline-label" sx={{ fontWeight: 600 }}>
                                {project.projectName || project.projectNumber}
                              </Typography>
                            </Box>
                          </Tooltip>
                        );
                      })}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default WeekView;
