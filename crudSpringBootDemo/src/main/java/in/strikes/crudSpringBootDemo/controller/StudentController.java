package in.strikes.crudSpringBootDemo.controller;

import in.strikes.crudSpringBootDemo.entity.Student;
import in.strikes.crudSpringBootDemo.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
@RequestMapping("/api/student_info")
@CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5500"})
public class StudentController {
    private  StudentService studentService;
    public  StudentController(StudentService studentService) {
        this.studentService = studentService;
    }
    @PostMapping("/create")
    public ResponseEntity<Student> create(@RequestBody Student student) {
        Student createStudent = studentService.create(student);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createStudent);
    }
    @GetMapping("/get/{rollno}")
    public ResponseEntity<Student> get(@PathVariable("rollno") Long rollno) {
        Student getStudent = studentService.get(rollno);
        if(getStudent == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(getStudent);
    }
//    @GetMapping("/getall")
//    public ResponseEntity<List<Student>> getAll() {
//        List<Student> getallStudent = studentService.getAll();
//        if(getallStudent == null) {
//            return ResponseEntity.notFound().build();
//        }
//        return ResponseEntity.ok(getallStudent);
//    }
    @PutMapping("/update/{rollno}")
    public ResponseEntity<Student> update(@PathVariable("rollno") Long rollno, @RequestBody Student student) {
        Student studentResp = studentService.update(rollno, student);

        if(studentResp == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(studentResp);
    }
//    @PatchMapping("/delete/{rollno}")
//    public ResponseEntity<String> delete(@PathVariable Long id) {
//        Boolean isDeleted = studentService.delete(id);
//
//        if(!isDeleted) {
//            return ResponseEntity.notFound().build();
//        }
//
//        return ResponseEntity.ok("Record deleted");
//    }
}


