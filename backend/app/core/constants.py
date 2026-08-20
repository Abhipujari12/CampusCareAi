class RoleNames:
    STUDENT = "Student"
    FACULTY = "Faculty"
    STAFF = "Staff"
    ADMIN = "Admin"
    SUPER_ADMIN = "Super Admin"

class PriorityNames:
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class StatusNames:
    NEW = "New"
    UNDER_REVIEW = "Under Review"
    ASSIGNED = "Assigned"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"
    CLOSED = "Closed"

# SLA Response Target Times in Hours
SLA_TARGET_HOURS = {
    PriorityNames.CRITICAL: 2,
    PriorityNames.HIGH: 8,
    PriorityNames.MEDIUM: 24,
    PriorityNames.LOW: 72
}
