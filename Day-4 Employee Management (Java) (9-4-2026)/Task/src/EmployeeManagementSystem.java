import java.util.*;

public class EmployeeManagementSystem {

    static ArrayList<Employee> empList = new ArrayList<>();
    static Scanner sc = new Scanner(System.in);

    public static void main(String[] args) {

        while (true) {
            System.out.println("\n===== Employee Management System =====");
            System.out.println("1. Add Employee");
            System.out.println("2. View Employees");
            System.out.println("3. Update Employee");
            System.out.println("4. Delete Employee");
            System.out.println("5. Exit");
            System.out.print("Enter choice: ");

            int choice = sc.nextInt();

            switch (choice) {
                case 1:
                    addEmployee();
                    break;
                case 2:
                    viewEmployees();
                    break;
                case 3:
                    updateEmployee();
                    break;
                case 4:
                    deleteEmployee();
                    break;
                case 5:
                    System.out.println("Exiting... Thank you!");
                    return;
                default:
                    System.out.println("Invalid choice!");
            }
        }
    }

    // Add Employee
    public static void addEmployee() {
        System.out.print("Enter ID: ");
        int id = sc.nextInt();

        sc.nextLine(); // clear buffer

        System.out.print("Enter Name: ");
        String name = sc.nextLine();

        System.out.print("Enter Salary: ");
        double salary = sc.nextDouble();

        empList.add(new Employee(id, name, salary));
        System.out.println("Employee Added Successfully!");
    }

    // View Employees
    public static void viewEmployees() {
        if (empList.isEmpty()) {
            System.out.println("No employees found!");
            return;
        }

        System.out.println("\n--- Employee List ---");
        for (Employee emp : empList) {
            emp.display();
        }
    }

    // Update Employee
    public static void updateEmployee() {
        System.out.print("Enter Employee ID to update: ");
        int id = sc.nextInt();

        for (Employee emp : empList) {
            if (emp.getId() == id) {
                sc.nextLine(); // clear buffer

                System.out.print("Enter new name: ");
                String name = sc.nextLine();

                System.out.print("Enter new salary: ");
                double salary = sc.nextDouble();

                emp.setName(name);
                emp.setSalary(salary);

                System.out.println("Employee Updated Successfully!");
                return;
            }
        }

        System.out.println("Employee not found!");
    }

    // Delete Employee
    public static void deleteEmployee() {
        System.out.print("Enter Employee ID to delete: ");
        int id = sc.nextInt();

        Iterator<Employee> iterator = empList.iterator();

        while (iterator.hasNext()) {
            Employee emp = iterator.next();

            if (emp.getId() == id) {
                iterator.remove();
                System.out.println("Employee Deleted Successfully!");
                return;
            }
        }

        System.out.println("Employee not found!");
    }
}