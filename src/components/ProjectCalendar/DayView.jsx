import React from "react";
import { Box, Typography, Paper, Tooltip } from "@mui/material";
import { useMemo, useState } from "react";

const DayView = ({ currentDate, visibleTimelineData, editRow }) => {
  const currentMonthDays = useMemo(() => {
    const days = [];
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    for (let i = 1; i <= endDate.getDate(); i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }
    return days;
  }, [currentDate]);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Paper elevation={2} className="gantt-container">
      <Box className="gantt-chart">
        {/* Timeline header: days of the month or week */}
        <Box className="timeline-header">
          <Box className="timeline-header-content" style={{ width: "100%" }}>
            {(() => {
              const weeks = [];
              let week = [];
              currentMonthDays.forEach((date, idx) => {
                week.push({ date, idx });
                // If Sunday or last day, push week
                if (date.getDay() === 0 || idx === currentMonthDays.length - 1) {
                  weeks.push(week);
                  week = [];
                }
              });
              return weeks.map((days, wIdx) =>
                days.map(({ date, idx }) => {
                  const isToday = (() => {
                    const today = new Date();
                    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
                  })();
                  return (
                    <Box key={idx} className={`month-column${isToday ? " today-header" : ""} week-bg-${wIdx % 2}`}>
                      <div className={isToday ? "day-today-circle" : ""} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <span style={{ fontSize: 10, fontWeight: 500 }}>{date.toLocaleDateString("en-US", { weekday: "short" })}</span>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{date.getDate()}</span>
                      </div>
                    </Box>
                  );
                })
              );
            })()}
          </Box>
        </Box>
        {/* Timeline rows: one per project with a bar in this month or week */}
        <Box className="timeline-rows">
          {visibleTimelineData.map(({ project, timelines }) => (
            <Box key={project.id} className="timeline-row">
              <Box className="timeline-content" style={{ position: "relative" }}>
                {timelines
                  .sort((a, b) => {
                    const rangeStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    const rangeEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
                    const aStart = new Date(Math.max(a.start, rangeStart));
                    const aEnd = new Date(Math.min(a.end, rangeEnd));
                    const bStart = new Date(Math.max(b.start, rangeStart));
                    const bEnd = new Date(Math.min(b.end, rangeEnd));
                    const aDuration = aEnd - aStart;
                    const bDuration = bEnd - bStart;
                    return bDuration - aDuration; // longest first, shortest last
                  })
                  .map((timeline, index) => {
                    const rangeStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    const rangeEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
                    const rangeDuration = rangeEnd - rangeStart;

                    const timelineStart = new Date(Math.max(timeline.start, rangeStart));
                    let timelineEnd = new Date(Math.min(timeline.end, rangeEnd));

                    if (timeline.end <= rangeEnd) {
                      timelineEnd.setHours(23, 59, 59, 999);
                    }

                    if (timelineEnd <= timelineStart) return null;
                    const startOffset = ((timelineStart - rangeStart) / rangeDuration) * 100;
                    const duration = ((timelineEnd - timelineStart) / rangeDuration) * 100;
                    const barRadius = (() => {
                      const isLeftFlat = timeline.start < rangeStart;
                      const isRightFlat = timeline.end > rangeEnd;
                      if (isLeftFlat && isRightFlat) return "0";
                      if (isLeftFlat) return "0 12px 12px 0";
                      if (isRightFlat) return "12px 0 0 12px";
                      return "12px";
                    })();
                    const assignedNames = (() => {
                      if (timeline.type === "drafting") return project.draftingTaskedTo?.join(", ") || "Unassigned";
                      if (timeline.type === "engineering") return project.engineeringTaskedTo?.join(", ") || "Unassigned";
                      if (timeline.type === "mep") return project.mepTaskedTo?.join(", ") || "Unassigned";
                      if (timeline.type === "civil") return project.civilTaskedTo?.join(", ") || "Unassigned";
                      return project.assignedTo?.join(", ") || "Unassigned";
                    })();
                    return (
                      <Tooltip
                        key={`${project.id}-${timeline.type}`}
                        title={
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#222" }}>
                              #{project.projectNumber} - {timeline.label}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#222" }}>
                              Assigned to: {assignedNames}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#222" }}>
                              Duration: {formatDate(timeline.start)} – {formatDate(timeline.end)}
                            </Typography>
                          </Box>
                        }
                        arrow
                        placement="top"
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
                              color: timeline.color,
                            },
                          },
                        }}>
                        <Box
                          className={`timeline-bar ${timeline.className}`}
                          style={{
                            left: `${startOffset}%`,
                            width: `${duration}%`,
                            zIndex: index + 1,
                            minHeight: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            borderRadius: barRadius,
                            cursor: "pointer",
                          }}
                          onClick={() => editRow(project.id)}>
                          <Typography variant="caption" className="timeline-label">
                            {project.projectNumber} - {project.projectName}
                          </Typography>
                        </Box>
                      </Tooltip>
                    );
                  })}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default DayView;
