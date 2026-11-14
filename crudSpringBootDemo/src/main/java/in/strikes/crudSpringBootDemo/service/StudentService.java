package in.strikes.crudSpringBootDemo.service;

import in.strikes.crudSpringBootDemo.entity.Student;
import in.strikes.crudSpringBootDemo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {
    private  StudentRepository studentRepository;
    public StudentService(StudentRepository studentRepository) {

        this.studentRepository = studentRepository;
    }

    public Student create(Student studentReq) {
        Student studentResp = studentRepository.save(studentReq);
        return studentResp;
    }
    public Student get(Long id) {
        Optional<Student> studentResp = studentRepository.findById(id);

        if(studentResp.isPresent()) {
            return studentResp.get();
        }
        return null;
    }
//    public List<Student> getAll() {
//        List<Student> studentList = studentRepository.findAll();
//        return studentList;
//    }
    public Student update(Long id, Student student) {
        Optional<Student> studentResp = studentRepository.findById(id);
        if(studentResp.isEmpty()) {
            return null;
        }
        Student studentToSave = studentResp.get();

        studentToSave.setName(student.getName());
        studentToSave.setRollno(student.getRollno());
        studentToSave.setCourse(student.getCourse());
        studentToSave.setEmail(student.getEmail());
        studentToSave.setAge(student.getAge());
        studentToSave.setDepartment(student.getDepartment());
        studentToSave.setDomain(student.getDomain());
        studentToSave.setYear(student.getYear());

        return studentRepository.save(studentToSave);
    }
}
