import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, IconButton, Paper, Accordion, AccordionSummary, AccordionDetails, Grid, Button } from "@mui/material";
import { ChevronLeft, ChevronRight, Today, ExpandMore } from "@mui/icons-material";
import DayView from "./DayView";
import WeekView from "./WeekView";

const ProjectCalendar = ({ projects = [], viewRow = () => {}, editRow = () => {} }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timelineExpanded, setTimelineExpanded] = useState(true);
  const [calendarView, setCalendarView] = useState("week"); // 'week' or 'month'

  const projectsWithTimeline = useMemo(() => {
    return projects.filter((project) => {
      return project.draftingEstimatedStartTime || project.draftingEstimatedDeliveryTime || project.engineeringEstimatedStartTime || project.engineeringEstimatedDeliveryTime || project.mepEstimatedStartTime || project.mepEstimatedDeliveryTime || project.civilEstimatedStartTime || project.civilEstimatedDeliveryTime;
    });
  }, [projects]);

  const timelineLegend = [
    { label: "Drafting", type: "drafting", color: "#198754", className: "bg-success text-white" },
    { label: "Engineering", type: "engineering", color: "#FFC107", className: "bg-warning text-dark" },
    { label: "MEP", type: "mep", color: "#212529", className: "bg-dark text-light" },
    { label: "Civil", type: "civil", color: "#5286F9", className: "bg-primary text-light" },
  ];

  const getTimelineLegendByType = (type) => timelineLegend.find((l) => l.type === type) || {};

  const timelineData = useMemo(() => {
    const timelineTypes = ["drafting", "engineering", "mep", "civil"];

    return projectsWithTimeline.map((project) => {
      const timelines = timelineTypes
        .map((type) => {
          const startKey = `${type}EstimatedStartTime`;
          const endKey = `${type}EstimatedDeliveryTime`;
          const startTime = project[startKey];
          const endTime = project[endKey];

          if (!startTime && !endTime) return null;

          const legend = getTimelineLegendByType(type);
          let startDate = startTime ? new Date(startTime) : new Date(endTime);
          let endDate = endTime ? new Date(endTime) : new Date(startTime);

          return {
            type,
            start: startDate,
            end: endDate,
            className: legend.className,
            color: legend.color,
            label: legend.label,
          };
        })
        .filter(Boolean);

      console.log(project.projectName, timelines);

      return { project, timelines };
    });
  }, [projectsWithTimeline]);

  const timelineOverlapsMonth = (timeline) => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
    return timeline.end >= monthStart && timeline.start <= monthEnd;
  };

  const visibleTimelineData = useMemo(() => {
    return timelineData
      .map(({ project, timelines }) => {
        const visibleTimelines = timelines.filter(timelineOverlapsMonth);

        if (visibleTimelines.length === 0) return null;

        return {
          project,
          timelines: visibleTimelines,
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        const aStart = Math.min(...a.timelines.map((tl) => tl.start));
        const bStart = Math.min(...b.timelines.map((tl) => tl.start));
        if (aStart !== bStart) return aStart - bStart;

        const aEnd = Math.min(...a.timelines.map((tl) => tl.end));
        const bEnd = Math.min(...b.timelines.map((tl) => tl.end));
        return aEnd - bEnd;
      });
  }, [timelineData, currentDate]);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getMonthName = () => {
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Paper className="project-calendar" elevation={2}>
      <Accordion expanded={timelineExpanded} onChange={() => setTimelineExpanded(!timelineExpanded)} className="timeline-accordion">
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Project Timeline</Typography>
        </AccordionSummary>
        <AccordionDetails className="p-2">
          <Box className="w-100 mb-1">
            <Box className="d-flex align-items-center justify-content-between mb-1">
              {/* Legend */}
              <Box className="ms-2 d-flex gap-2 flex-wrap">
                {timelineLegend.map((item) => (
                  <Box key={item.label} sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                    <Box className={item.className} sx={{ width: 18, height: 8, borderRadius: 2, backgroundColor: item.color, mr: 1 }} />
                    <Typography variant="caption">{item.label}</Typography>
                  </Box>
                ))}
              </Box>
              <Box className="calendar-controls" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {/* View toggle */}
                <Button
                  variant={calendarView === "week" ? "contained" : "outlined"}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCalendarView("week");
                  }}
                  sx={{ minWidth: 60 }}>
                  Week View
                </Button>
                <Button
                  variant={calendarView === "day" ? "contained" : "outlined"}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCalendarView("day");
                  }}
                  sx={{ minWidth: 60 }}>
                  Day View
                </Button>

                <>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviousMonth();
                    }}
                    size="small">
                    <ChevronLeft />
                  </IconButton>
                  <Typography variant="subtitle1" sx={{ minWidth: 100, textAlign: "center", fontWeight: 500 }}>
                    {getMonthName()}
                  </Typography>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextMonth();
                    }}
                    size="small">
                    <ChevronRight />
                  </IconButton>
                </>
              </Box>
            </Box>
          </Box>
          {calendarView === "day" && <DayView currentDate={currentDate} visibleTimelineData={visibleTimelineData} editRow={editRow} />}
          {calendarView === "week" && <WeekView currentDate={currentDate} visibleTimelineData={visibleTimelineData} editRow={editRow} />}
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default ProjectCalendar;
