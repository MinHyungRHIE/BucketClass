package com.pap.bucketclass.service;

import static com.pap.bucketclass.util.RoleFilter.containRoleByName;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.pap.bucketclass.entity.Member;
import com.pap.bucketclass.model.CustomerMyPageModel;
import com.pap.bucketclass.model.PasswordModel;
import com.pap.bucketclass.repository.MemberRepository;

@Service
public class CustomerMyPageService {
	
	@Autowired
	private LocalMemberDetailsService memberDetailsService;
	@Autowired
	private MemberRepository memberRepo;

	//사용자 마이페이지 보기
	@Transactional
	public Member loadMember(String memberId) {
		Member member = (Member) memberDetailsService.loadUserByUsername(memberId);
		Member found = null;
		if(containRoleByName(member.getRoles(), "ROLE_CUSTOMER")) {
			found = memberRepo.findByMemberId(memberId);
		}else {
			throw new AccessDeniedException("403 error");
		}
		return found;
	}
	
	//사용자 정보 변경
	@Transactional
	public Member updateMember(CustomerMyPageModel customerModel, String memberId) {
		Member member = memberRepo.findByMemberId(memberId);
		if (member != null) {
			member.setMemberNickname(customerModel.getMemberNickname());
			member.setMemberImg(customerModel.getMemberImg());
			member.setMemberEmail(customerModel.getMemberEmail());
			member.setIntroduce(customerModel.getIntroduce());
		} else {
			throw new AccessDeniedException("403 error");
		}
		return memberRepo.save(member);
	}
	
	//사용자 비밀번호 변경
	@Transactional
	public Boolean changePassword(PasswordModel model, String memberId) {
		Member member = memberRepo.findByMemberId(memberId);
		if(member != null && 
				member.getPassword().equals(model.getMemberPassword()) &&
				!(model.getMemberPassword().equals(model.getNewPassword()))) {
			member.setMemberPassword(model.getNewPassword());
			memberRepo.save(member);
			return true;
		}else {
			return false;
		}
	}
	
}
